'use server';

import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import type { ProductWithPrice } from '@/interface/product';
import { createPublicClient } from '@/lib/supabase/server';

export async function getProducts(options?: {
  sortBy?: 'newest' | 'popular' | 'name';
  limit?: number;
}): Promise<ProductWithPrice[]> {
  'use cache';
  cacheTag('products', `products-${options?.sortBy || 'all'}-${options?.limit || 'all'}`);
  cacheLife('minutes');

  const supabase = createPublicClient();

  let query = supabase.from('product').select(`
      *,
      product_price (*)
    `);

  // Aplicar ordenamiento
  switch (options?.sortBy) {
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'popular':
      // Por ahora ordenamos por ID, se puede cambiar cuando haya un campo de ventas
      query = query.order('id', { ascending: false });
      break;
    case 'name':
      query = query.order('name', { ascending: true });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  // Aplicar límite si se especifica
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    throw new Error(error.message);
  }

  return (data || []).map(product => ({
    ...product,
    product_price: Array.isArray(product.product_price)
      ? product.product_price[0] || null
      : product.product_price || null,
  })) as ProductWithPrice[];
}

export async function getProductById(id: number): Promise<ProductWithPrice | null> {
  'use cache';
  cacheTag('products', `product-${id}`);
  cacheLife('minutes');

  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from('product')
    .select(`
      *,
      product_price (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No se encontró el producto
      return null;
    }
    console.error('Error fetching product:', error);
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return {
    ...data,
    product_price: Array.isArray(data.product_price) ? data.product_price[0] || null : data.product_price || null,
  } as ProductWithPrice;
}

export async function searchProducts(query: string): Promise<ProductWithPrice[]> {
  'use cache';
  cacheTag('products', `products-search-${query}`);
  cacheLife('minutes');

  if (!query || query.trim().length === 0) {
    return getProducts();
  }

  const supabase = createPublicClient();

  const searchTerm = `%${query.trim()}%`;

  const { data, error } = await supabase
    .from('product')
    .select(`
      *,
      product_price (*)
    `)
    .or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching products:', error);
    throw new Error(error.message);
  }

  return (data || []).map(product => ({
    ...product,
    product_price: Array.isArray(product.product_price)
      ? product.product_price[0] || null
      : product.product_price || null,
  })) as ProductWithPrice[];
}
