'use server';

import 'server-only';

import { revalidateTag } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { CartItemWithProduct } from '@/interface/product';

export async function getCart(): Promise<CartItemWithProduct[]> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  const { data, error } = await supabase
    .from('cart')
    .select(`
      *,
      product:product_id (
        *,
        product_price (*)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching cart:', error);
    throw new Error(error.message);
  }

  return (data || []).map(item => ({
    ...item,
    product: Array.isArray(item.product) 
      ? {
          ...item.product[0],
          product_price: Array.isArray(item.product[0]?.product_price)
            ? item.product[0].product_price[0] || null
            : item.product[0]?.product_price || null,
        }
      : item.product ? {
          ...item.product,
          product_price: Array.isArray(item.product.product_price)
            ? item.product.product_price[0] || null
            : item.product.product_price || null,
        } : null,
  })) as CartItemWithProduct[];
}

export async function addToCart(productId: number, quantity: number = 1): Promise<CartItemWithProduct> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  // Verificar si el producto ya está en el carrito
  const { data: existingItem } = await supabase
    .from('cart')
    .select('*')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .single();

  if (existingItem) {
    // Actualizar cantidad
    return updateCartItem(existingItem.id, existingItem.quantity + quantity);
  }

  // Verificar stock del producto
  const { data: product } = await supabase
    .from('product')
    .select('quantity')
    .eq('id', productId)
    .single();

  if (product && product.quantity !== null && product.quantity < quantity) {
    throw new Error('Stock insuficiente');
  }

  // Agregar al carrito
  const { data, error } = await supabase
    .from('cart')
    .insert({
      user_id: user.id,
      product_id: productId,
      quantity,
    })
    .select(`
      *,
      product:product_id (
        *,
        product_price (*)
      )
    `)
    .single();

  if (error) {
    console.error('Error adding to cart:', error);
    throw new Error(error.message);
  }

  revalidateTag('cart');

  return {
    ...data,
    product: Array.isArray(data.product) 
      ? {
          ...data.product[0],
          product_price: Array.isArray(data.product[0]?.product_price)
            ? data.product[0].product_price[0] || null
            : data.product[0]?.product_price || null,
        }
      : data.product ? {
          ...data.product,
          product_price: Array.isArray(data.product.product_price)
            ? data.product.product_price[0] || null
            : data.product.product_price || null,
        } : null,
  } as CartItemWithProduct;
}

export async function removeFromCart(cartItemId: number): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  const { error } = await supabase
    .from('cart')
    .delete()
    .eq('id', cartItemId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error removing from cart:', error);
    throw new Error(error.message);
  }

  revalidateTag('cart');
}

export async function updateCartItem(cartItemId: number, quantity: number): Promise<CartItemWithProduct> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  if (quantity <= 0) {
    await removeFromCart(cartItemId);
    throw new Error('Cantidad debe ser mayor a 0');
  }

  // Obtener el item del carrito para verificar el producto
  const { data: cartItem } = await supabase
    .from('cart')
    .select('product_id')
    .eq('id', cartItemId)
    .eq('user_id', user.id)
    .single();

  if (!cartItem) {
    throw new Error('Item no encontrado en el carrito');
  }

  // Verificar stock
  const { data: product } = await supabase
    .from('product')
    .select('quantity')
    .eq('id', cartItem.product_id)
    .single();

  if (product && product.quantity !== null && product.quantity < quantity) {
    throw new Error('Stock insuficiente');
  }

  const { data, error } = await supabase
    .from('cart')
    .update({ quantity })
    .eq('id', cartItemId)
    .eq('user_id', user.id)
    .select(`
      *,
      product:product_id (
        *,
        product_price (*)
      )
    `)
    .single();

  if (error) {
    console.error('Error updating cart item:', error);
    throw new Error(error.message);
  }

  revalidateTag('cart');

  return {
    ...data,
    product: Array.isArray(data.product) 
      ? {
          ...data.product[0],
          product_price: Array.isArray(data.product[0]?.product_price)
            ? data.product[0].product_price[0] || null
            : data.product[0]?.product_price || null,
        }
      : data.product ? {
          ...data.product,
          product_price: Array.isArray(data.product.product_price)
            ? data.product.product_price[0] || null
            : data.product.product_price || null,
        } : null,
  } as CartItemWithProduct;
}

export async function clearCart(): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  const { error } = await supabase
    .from('cart')
    .delete()
    .eq('user_id', user.id);

  if (error) {
    console.error('Error clearing cart:', error);
    throw new Error(error.message);
  }

  revalidateTag('cart');
}

export async function purchaseCart(): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  // Obtener el carrito con productos y precios
  const cart = await getCart();

  if (cart.length === 0) {
    throw new Error('El carrito está vacío');
  }

  // Calcular totales
  let totalPoints = 0;
  let totalStars = 0;
  let totalARS = 0;

  // Verificar stock y calcular totales
  for (const item of cart) {
    if (!item.product || !item.product.product_price) {
      throw new Error(`Producto ${item.product_id} no encontrado o sin precio`);
    }

    // Verificar stock
    if (item.product.quantity !== null && item.product.quantity < item.quantity) {
      throw new Error(`Stock insuficiente para ${item.product.name}`);
    }

    const price = item.product.product_price;
    totalPoints += (price.price_points || 0) * item.quantity;
    totalStars += (price.price_star || 0) * item.quantity;
    totalARS += (price.price_ars || 0) * item.quantity;
  }

  // Obtener todas las estadísticas del usuario (puede tener múltiples canales)
  const { data: userStats, error: statsError } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', user.id);

  if (statsError) {
    console.error('Error obteniendo user_stats:', statsError);
    throw new Error(statsError.message);
  }

  if (!userStats || userStats.length === 0) {
    throw new Error('No se encontraron estadísticas del usuario');
  }

  // Calcular totales disponibles del usuario (suma de todos los canales)
  const availablePoints = userStats.reduce((sum, stat) => sum + stat.points, 0);
  const availableStars = userStats.reduce((sum, stat) => sum + stat.stars, 0);

  // Verificar si el usuario tiene suficientes puntos/estrellas
  if (totalPoints > availablePoints) {
    throw new Error(`Puntos insuficientes. Necesitas ${totalPoints}, tienes ${availablePoints}`);
  }

  if (totalStars > availableStars) {
    throw new Error(`Estrellas insuficientes. Necesitas ${totalStars}, tienes ${availableStars}`);
  }

  // Procesar la compra: deducir puntos/estrellas y actualizar stock
  // Por simplicidad, deducimos proporcionalmente de cada canal
  // En una implementación más compleja, podrías elegir de qué canal deducir primero

  for (const stat of userStats) {
    const channelPoints = stat.points;
    const channelStars = stat.stars;
    
    // Calcular proporción de este canal
    const pointsRatio = availablePoints > 0 ? channelPoints / availablePoints : 0;
    const starsRatio = availableStars > 0 ? channelStars / availableStars : 0;
    
    // Calcular cuánto deducir de este canal
    const pointsToDeduct = Math.min(Math.floor(totalPoints * pointsRatio), channelPoints);
    const starsToDeduct = Math.min(Math.floor(totalStars * starsRatio), channelStars);

    if (pointsToDeduct > 0 || starsToDeduct > 0) {
      await supabase
        .from('user_stats')
        .update({
          points: Math.max(0, channelPoints - pointsToDeduct),
          stars: Math.max(0, channelStars - starsToDeduct),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .eq('channel', stat.channel);
    }
  }

  // Actualizar stock de productos
  for (const item of cart) {
    if (item.product && item.product.quantity !== null) {
      await supabase
        .from('product')
        .update({
          quantity: item.product.quantity - item.quantity,
          update_at: new Date().toISOString(),
        })
        .eq('id', item.product_id);
    }
  }

  // Limpiar el carrito
  await clearCart();

  // Revalidar cachés
  revalidateTag('cart');
  revalidateTag('global-rank');
  revalidateTag('week-rank');
  revalidateTag('points-rank');
  revalidateTag('products');

  return {
    success: true,
    message: 'Compra realizada exitosamente',
  };
}
