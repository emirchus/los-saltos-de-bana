import { useState } from 'react';
import { toast } from 'sonner';
import type { ProductWithVariants } from '@/interface/product';
import type { GetProductsAdminOptions, GetProductsAdminResult } from '../actions/products-admin-action';
import {
  archiveProduct,
  deleteProduct,
  duplicateProduct,
  getProductsAdmin as fetchProductsAdmin,
} from '../actions/products-admin-action';

const PAGE_SIZE = 20;

export function useProductsTable(initialProducts: GetProductsAdminResult) {
  const [products, setProducts] = useState(initialProducts.products);
  const [total, setTotal] = useState(initialProducts.total);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [archivedFilter, setArchivedFilter] = useState<boolean | undefined>(undefined);
  const [lowStockFilter, setLowStockFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<number | null>(null);
  const [archivingId, setArchivingId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductWithVariants | null>(null);

  const loadProducts = async (options?: GetProductsAdminOptions & { debouncedSearch?: string }) => {
    setIsLoading(true);
    try {
      const search = options?.debouncedSearch !== undefined ? options.debouncedSearch : searchQuery.trim() || undefined;
      const result = await fetchProductsAdmin({
        search,
        archived: options?.archived !== undefined ? options.archived : archivedFilter,
        lowStockOnly: options?.lowStockOnly !== undefined ? options.lowStockOnly : lowStockFilter,
        page: options?.page !== undefined ? options.page : page,
        pageSize: PAGE_SIZE,
      });
      setProducts(result.products);
      setTotal(result.total);
      return result;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al cargar productos');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (product: ProductWithVariants) => {
    setDeletingId(product.id);
    try {
      await deleteProduct(product.id);
      toast.success('Producto eliminado correctamente');
      await loadProducts();
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar producto');
      return false;
    } finally {
      setDeletingId(null);
    }
  };

  const handleDuplicate = async (product: ProductWithVariants) => {
    setDuplicatingId(product.id);
    try {
      await duplicateProduct(product.id);
      toast.success('Producto duplicado correctamente');
      await loadProducts();
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al duplicar producto');
      return false;
    } finally {
      setDuplicatingId(null);
    }
  };

  const handleArchive = async (product: ProductWithVariants) => {
    setArchivingId(product.id);
    try {
      await archiveProduct(product.id, !product.archived);
      toast.success(product.archived ? 'Producto desarchivado' : 'Producto archivado');
      await loadProducts();
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al archivar producto');
      return false;
    } finally {
      setArchivingId(null);
    }
  };

  const openDeleteDialog = (product: ProductWithVariants) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setArchivedFilter(undefined);
    setLowStockFilter(false);
    setPage(0);
  };

  return {
    // State
    products,
    total,
    page,
    setPage,
    searchQuery,
    setSearchQuery,
    archivedFilter,
    setArchivedFilter,
    lowStockFilter,
    setLowStockFilter,
    isLoading,
    deletingId,
    duplicatingId,
    archivingId,
    deleteDialogOpen,
    productToDelete,
    // Actions
    loadProducts,
    handleDelete,
    handleDuplicate,
    handleArchive,
    openDeleteDialog,
    closeDeleteDialog,
    resetFilters,
    // Computed
    totalPages: Math.ceil(total / PAGE_SIZE),
    startItem: page * PAGE_SIZE + 1,
    endItem: Math.min((page + 1) * PAGE_SIZE, total),
  };
}
