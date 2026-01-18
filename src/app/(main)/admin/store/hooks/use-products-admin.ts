import { useState } from 'react';
import type { ProductWithVariants } from '@/interface/product';
import type { GetProductsAdminResult } from '../actions/products-admin-action';
import { getProductsAdmin as fetchProductsAdmin } from '../actions/products-admin-action';

export function useProductsAdmin(initialProducts: GetProductsAdminResult) {
  const [products, setProducts] = useState(initialProducts);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshProducts = async (options?: {
    search?: string;
    archived?: boolean;
    lowStockOnly?: boolean;
    page?: number;
    pageSize?: number;
  }) => {
    setIsRefreshing(true);
    try {
      const result = await fetchProductsAdmin({
        page: 0,
        pageSize: 20,
        ...options,
      });
      setProducts(result);
      return result;
    } catch (error) {
      console.error('Error al refrescar productos:', error);
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  };

  const updateProductInList = (updatedProduct: ProductWithVariants) => {
    setProducts(prev => ({
      ...prev,
      products: prev.products.map(p => (p.id === updatedProduct.id ? updatedProduct : p)),
    }));
  };

  const removeProductFromList = (productId: number) => {
    setProducts(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== productId),
      total: prev.total - 1,
    }));
  };

  const findProductById = (productId: number): ProductWithVariants | undefined => {
    return products.products.find(p => p.id === productId);
  };

  return {
    products,
    setProducts,
    refreshProducts,
    updateProductInList,
    removeProductFromList,
    findProductById,
    isRefreshing,
  };
}
