import { useState } from 'react';
import type { ProductWithVariants } from '@/interface/product';

export function useProductForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithVariants | null>(null);

  const openCreate = () => {
    setEditingProduct(null);
    setIsOpen(true);
  };

  const openEdit = (product: ProductWithVariants) => {
    setEditingProduct(product);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setEditingProduct(null);
  };

  const handleSuccess = (callback?: () => void) => {
    close();
    callback?.();
  };

  return {
    isOpen,
    editingProduct,
    openCreate,
    openEdit,
    close,
    handleSuccess,
  };
}
