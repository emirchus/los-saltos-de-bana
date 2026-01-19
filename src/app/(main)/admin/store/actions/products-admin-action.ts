'use server';

import 'server-only';

import { cacheLife, cacheTag, revalidatePath, revalidateTag } from 'next/cache';
import type { ProductVariantInsert, ProductVariantUpdate, ProductWithVariants } from '@/interface/product';
import { ensureAuthenticated } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types_db';

type ProductPriceUpdate = Database['public']['Tables']['product_price']['Update'];

export interface GetProductsAdminOptions {
  search?: string;
  archived?: boolean;
  lowStockOnly?: boolean;
  page?: number;
  pageSize?: number;
}

export interface GetProductsAdminResult {
  products: ProductWithVariants[];
  total: number;
}

// CRUD de Productos

export async function getProductsAdmin(options?: GetProductsAdminOptions): Promise<GetProductsAdminResult> {
  const supabase = await ensureAuthenticated();
  const { search, archived, lowStockOnly, page = 0, pageSize = 20 } = options || {};

  // Construir query base
  let countQuery = supabase.from('product').select('*', { count: 'exact', head: true });
  let dataQuery = supabase
    .from('product')
    .select(`
      *,
      product_price (*),
      product_variant (*)
    `)
    .order('created_at', { ascending: false })
    .range(page * pageSize, (page + 1) * pageSize - 1);

  // Aplicar filtros
  if (archived !== undefined) {
    countQuery = countQuery.eq('archived', archived);
    dataQuery = dataQuery.eq('archived', archived);
  }

  if (search) {
    const searchPattern = `%${search}%`;
    countQuery = countQuery.or(`name.ilike.${searchPattern},description.ilike.${searchPattern}`);
    dataQuery = dataQuery.or(`name.ilike.${searchPattern},description.ilike.${searchPattern}`);
  }

  const { count } = await countQuery;
  const { data, error } = await dataQuery;

  if (error) {
    console.error('Error obteniendo productos:', error);
    throw new Error(error.message);
  }

  let products = (data || []).map(product => ({
    ...product,
    product_price: Array.isArray(product.product_price)
      ? product.product_price[0] || null
      : product.product_price || null,
    product_variants: Array.isArray(product.product_variant) ? product.product_variant : [],
  })) as ProductWithVariants[];

  // Filtrar por stock bajo si es necesario
  if (lowStockOnly) {
    products = products.filter(product => {
      // Si tiene variantes, verificar stock de variantes
      if (product.product_variants && product.product_variants.length > 0) {
        return product.product_variants.some(variant => {
          const threshold = variant.low_stock_threshold ?? 10;
          return variant.stock <= threshold;
        });
      }
      // Si no tiene variantes, verificar stock del producto
      const threshold = product.low_stock_threshold ?? 10;
      return (product.quantity ?? 0) <= threshold;
    });
  }

  return {
    products,
    total: count || 0,
  };
}

export async function getProductByIdAdmin(id: number): Promise<ProductWithVariants | null> {
  const supabase = await ensureAuthenticated();

  const { data, error } = await supabase
    .from('product')
    .select(`
      *,
      product_price (*),
      product_variant (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error obteniendo producto:', error);
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return {
    ...data,
    product_price: Array.isArray(data.product_price) ? data.product_price[0] || null : data.product_price || null,
    product_variants: Array.isArray(data.product_variant) ? data.product_variant : [],
  } as ProductWithVariants;
}

export async function createProduct(data: {
  name: string;
  description?: string | null;
  image?: string | null;
  price_ars?: number | null;
  price_promo_ars?: number | null;
  price_wholesale_ars?: number | null;
  price_points?: number | null;
  price_star?: number | null;
  quantity?: number | null;
  low_stock_threshold?: number | null;
  archived?: boolean;
}): Promise<ProductWithVariants> {
  const supabase = await ensureAuthenticated();

  // Crear precio primero
  const { data: priceData, error: priceError } = await supabase
    .from('product_price')
    .insert({
      price_ars: data.price_ars,
      price_promo_ars: data.price_promo_ars,
      price_wholesale_ars: data.price_wholesale_ars,
      price_points: data.price_points,
      price_star: data.price_star,
    })
    .select()
    .single();

  if (priceError) {
    console.error('Error creando precio:', priceError);
    throw new Error(priceError.message);
  }

  // Crear producto
  const { data: productData, error: productError } = await supabase
    .from('product')
    .insert({
      name: data.name,
      description: data.description,
      image: data.image,
      price_id: priceData.id,
      quantity: data.quantity,
      low_stock_threshold: data.low_stock_threshold,
      archived: data.archived ?? false,
    })
    .select(`
      *,
      product_price (*),
      product_variant (*)
    `)
    .single();

  if (productError) {
    // Si falla, eliminar el precio creado
    await supabase.from('product_price').delete().eq('id', priceData.id);
    console.error('Error creando producto:', productError);
    throw new Error(productError.message);
  }

  revalidateTag('products', 'products');
  revalidatePath('/admin/store', 'layout');
  revalidatePath('/store', 'layout');

  return {
    ...productData,
    product_price: Array.isArray(productData.product_price)
      ? productData.product_price[0] || null
      : productData.product_price || null,
    product_variants: Array.isArray(productData.product_variant) ? productData.product_variant : [],
  } as ProductWithVariants;
}

export async function updateProduct(
  id: number,
  data: Partial<{
    name: string;
    description: string | null;
    image: string | null;
    quantity: number | null;
    low_stock_threshold: number | null;
    archived: boolean;
  }>
): Promise<ProductWithVariants> {
  const supabase = await ensureAuthenticated();

  const { data: productData, error } = await supabase
    .from('product')
    .update(data)
    .eq('id', id)
    .select(`
      *,
      product_price (*),
      product_variant (*)
    `)
    .single();

  if (error) {
    console.error('Error actualizando producto:', error);
    throw new Error(error.message);
  }

  revalidateTag('products', 'products');
  revalidatePath('/admin/store');

  return {
    ...productData,
    product_price: Array.isArray(productData.product_price)
      ? productData.product_price[0] || null
      : productData.product_price || null,
    product_variants: Array.isArray(productData.product_variant) ? productData.product_variant : [],
  } as ProductWithVariants;
}

export async function duplicateProduct(id: number): Promise<ProductWithVariants> {
  const supabase = await ensureAuthenticated();

  // Obtener producto original
  const original = await getProductByIdAdmin(id);
  if (!original) {
    throw new Error('Producto no encontrado');
  }

  // Crear nuevo precio
  const { data: priceData, error: priceError } = await supabase
    .from('product_price')
    .insert({
      price_ars: original.product_price?.price_ars,
      price_promo_ars: original.product_price?.price_promo_ars,
      price_wholesale_ars: original.product_price?.price_wholesale_ars,
      price_points: original.product_price?.price_points,
      price_star: original.product_price?.price_star,
    })
    .select()
    .single();

  if (priceError) {
    console.error('Error creando precio duplicado:', priceError);
    throw new Error(priceError.message);
  }

  // Crear producto duplicado
  const { data: productData, error: productError } = await supabase
    .from('product')
    .insert({
      name: `${original.name} (Copia)`,
      description: original.description,
      image: original.image,
      price_id: priceData.id,
      quantity: original.quantity,
      low_stock_threshold: original.low_stock_threshold,
      archived: false,
    })
    .select(`
      *,
      product_price (*),
      product_variant (*)
    `)
    .single();

  if (productError) {
    await supabase.from('product_price').delete().eq('id', priceData.id);
    console.error('Error duplicando producto:', productError);
    throw new Error(productError.message);
  }

  // Duplicar variantes si existen
  if (original.product_variants && original.product_variants.length > 0) {
    const variantsToInsert = original.product_variants.map(variant => ({
      product_id: productData.id,
      size: variant.size,
      color: variant.color,
      weight: variant.weight,
      sku: `${variant.sku}-COPY-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      stock: variant.stock,
      low_stock_threshold: variant.low_stock_threshold,
    }));

    await supabase.from('product_variant').insert(variantsToInsert);
  }

  // Obtener producto completo con variantes
  const duplicated = await getProductByIdAdmin(productData.id);
  if (!duplicated) {
    throw new Error('Error al obtener producto duplicado');
  }

  revalidateTag('products', 'products');
  revalidatePath('/admin/store', 'layout');
  revalidatePath('/store', 'layout');

  return duplicated;
}

export async function archiveProduct(id: number, archived: boolean): Promise<ProductWithVariants> {
  return updateProduct(id, { archived });
}

export async function deleteProduct(id: number): Promise<void> {
  const supabase = await ensureAuthenticated();

  // Obtener producto para eliminar el precio asociado
  const product = await getProductByIdAdmin(id);
  if (!product) {
    throw new Error('Producto no encontrado');
  }

  // Eliminar producto (las variantes se eliminan por CASCADE)
  const { error: productError } = await supabase.from('product').delete().eq('id', id);

  if (productError) {
    console.error('Error eliminando producto:', productError);
    throw new Error(productError.message);
  }

  // Eliminar precio si existe
  if (product.price_id) {
    await supabase.from('product_price').delete().eq('id', product.price_id);
  }

  revalidateTag('products', 'products');
  revalidatePath('/admin/store');
}

// Gestión de Variantes

export async function getProductVariants(productId: number) {
  const supabase = await ensureAuthenticated();

  const { data, error } = await supabase
    .from('product_variant')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error obteniendo variantes:', error);
    throw new Error(error.message);
  }

  return data || [];
}

export async function createProductVariant(
  productId: number,
  data: ProductVariantInsert
): Promise<ProductVariantInsert & { id: number }> {
  const supabase = await ensureAuthenticated();

  const { data: variantData, error } = await supabase
    .from('product_variant')
    .insert({
      ...data,
      product_id: productId,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creando variante:', error);
    throw new Error(error.message);
  }

  revalidateTag('products', 'products');
  revalidatePath('/admin/store', 'layout');
  revalidatePath('/store', 'layout');

  return variantData;
}

export async function updateProductVariant(
  variantId: number,
  data: ProductVariantUpdate
): Promise<ProductVariantUpdate & { id: number }> {
  const supabase = await ensureAuthenticated();

  const { data: variantData, error } = await supabase
    .from('product_variant')
    .update(data)
    .eq('id', variantId)
    .select()
    .single();

  if (error) {
    console.error('Error actualizando variante:', error);
    throw new Error(error.message);
  }

  revalidateTag('products', 'products');
  revalidatePath('/admin/store', 'layout');
  revalidatePath('/store', 'layout');
  return variantData;
}

export async function deleteProductVariant(variantId: number): Promise<void> {
  const supabase = await ensureAuthenticated();

  const { error } = await supabase.from('product_variant').delete().eq('id', variantId);

  if (error) {
    console.error('Error eliminando variante:', error);
    throw new Error(error.message);
  }
  revalidateTag('products', 'products');
  revalidatePath('/admin/store', 'layout');
  revalidatePath('/store', 'layout');
}

// Gestión de Precios

export async function updateProductPrice(
  priceId: number,
  data: ProductPriceUpdate
): Promise<ProductPriceUpdate & { id: number }> {
  const supabase = await ensureAuthenticated();

  const { data: priceData, error } = await supabase
    .from('product_price')
    .update(data)
    .eq('id', priceId)
    .select()
    .single();

  if (error) {
    console.error('Error actualizando precio:', error);
    throw new Error(error.message);
  }
  revalidateTag('products', 'products');
  revalidatePath('/admin/store', 'layout');
  revalidatePath('/store', 'layout');

  return priceData;
}

// Alertas de Stock Bajo

export interface LowStockAlert {
  product: ProductWithVariants;
  variant?: {
    id: number;
    sku: string;
    stock: number;
    threshold: number;
  };
  stock: number;
  threshold: number;
}

export async function getLowStockAlerts(): Promise<LowStockAlert[]> {
  const supabase = await ensureAuthenticated();

  // Obtener todos los productos activos
  const { data: products, error } = await supabase
    .from('product')
    .select(`
      *,
      product_price (*),
      product_variant (*)
    `)
    .eq('archived', false);

  if (error) {
    console.error('Error obteniendo productos para alertas:', error);
    throw new Error(error.message);
  }

  const alerts: LowStockAlert[] = [];

  for (const product of products || []) {
    const productWithVariants = {
      ...product,
      product_price: Array.isArray(product.product_price)
        ? product.product_price[0] || null
        : product.product_price || null,
      product_variants: Array.isArray(product.product_variant) ? product.product_variant : [],
    } as ProductWithVariants;

    // Si tiene variantes, verificar cada una
    if (productWithVariants.product_variants && productWithVariants.product_variants.length > 0) {
      for (const variant of productWithVariants.product_variants) {
        const threshold = variant.low_stock_threshold ?? 10;
        if (variant.stock <= threshold) {
          alerts.push({
            product: productWithVariants,
            variant: {
              id: variant.id,
              sku: variant.sku,
              stock: variant.stock,
              threshold,
            },
            stock: variant.stock,
            threshold,
          });
        }
      }
    } else {
      // Si no tiene variantes, verificar stock del producto
      const threshold = productWithVariants.low_stock_threshold ?? 10;
      const stock = productWithVariants.quantity ?? 0;
      if (stock <= threshold) {
        alerts.push({
          product: productWithVariants,
          stock,
          threshold,
        });
      }
    }
  }

  return alerts;
}

export async function getLowStockCount(): Promise<number> {
  const alerts = await getLowStockAlerts();
  return alerts.length;
}
