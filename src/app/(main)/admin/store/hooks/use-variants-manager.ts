import { useState } from 'react';
import type { ProductWithVariants } from '@/interface/product';
import { getProductsAdmin as fetchProductsAdmin } from '../actions/products-admin-action';

export function useVariantsManager() {
  const [selectedProduct, setSelectedProduct] = useState<ProductWithVariants | null>(null);

  const selectProduct = (product: ProductWithVariants) => {
    setSelectedProduct(product);
  };

  const clearSelection = () => {
    setSelectedProduct(null);
  };

  const refreshSelectedProduct = async () => {
    if (!selectedProduct) return;

    try {
      const result = await fetchProductsAdmin({ page: 0, pageSize: 20 });
      const updated = result.products.find(p => p.id === selectedProduct.id);
      if (updated) {
        setSelectedProduct(updated);
        return updated;
      }
    } catch (error) {
      console.error('Error al refrescar producto:', error);
    }
    return null;
  };

  return {
    selectedProduct,
    selectProduct,
    clearSelection,
    refreshSelectedProduct,
  };
}
