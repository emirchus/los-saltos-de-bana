'use client';

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Archive, ArrowUpDown, Copy, Edit, Loader2, Package, Search, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDebounce } from '@/hooks/use-debounce';
import type { ProductWithVariants } from '@/interface/product';
import type { GetProductsAdminResult } from '../actions/products-admin-action';
import { useProductsTable } from '../hooks/use-products-table';

interface ProductsAdminTableProps {
  initialProducts: GetProductsAdminResult;
  onEdit: (product: ProductWithVariants) => void;
  onManageVariants?: (product: ProductWithVariants) => void;
  refreshKey?: number;
}

const PAGE_SIZE = 20;

const getTotalStock = (product: ProductWithVariants): number => {
  if (product.product_variants && product.product_variants.length > 0) {
    return product.product_variants.reduce((sum, variant) => sum + variant.stock, 0);
  }
  return product.quantity ?? 0;
};

const hasLowStock = (product: ProductWithVariants): boolean => {
  if (product.product_variants && product.product_variants.length > 0) {
    return product.product_variants.some(variant => {
      const threshold = variant.low_stock_threshold ?? 10;
      return variant.stock <= threshold;
    });
  }
  const threshold = product.low_stock_threshold ?? 10;
  return (product.quantity ?? 0) <= threshold;
};

export function ProductsAdminTable({ initialProducts, onEdit, onManageVariants, refreshKey }: ProductsAdminTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const {
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
    loadProducts,
    handleDelete: deleteProductAction,
    handleDuplicate,
    handleArchive,
    openDeleteDialog,
    closeDeleteDialog,
    totalPages,
    startItem,
    endItem,
  } = useProductsTable(initialProducts);

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Cargar productos cuando cambian los filtros o cuando se refresca
  useEffect(() => {
    loadProducts({ debouncedSearch });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, archivedFilter, lowStockFilter, page, refreshKey]);

  const handleDelete = async () => {
    if (!productToDelete) return;
    const success = await deleteProductAction(productToDelete);
    if (success) {
      closeDeleteDialog();
    }
  };

  const columns: ColumnDef<ProductWithVariants>[] = [
    {
      accessorKey: 'image',
      header: 'Imagen',
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="relative h-12 w-12 overflow-hidden rounded-md">
            <Image src={product.image || '/placeholder.svg'} alt={product.name} fill className="object-cover" />
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 px-2"
          >
            Nombre
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const product = row.original;
        const hasVariants = product.product_variants && product.product_variants.length > 0;
        return (
          <div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onManageVariants?.(product)}
                className="font-medium hover:text-primary transition-colors text-left"
              >
                {product.name}
              </button>
              {hasVariants && (
                <Badge variant="outline" className="text-xs">
                  <Package className="mr-1 h-3 w-3" />
                  {product.product_variants?.length}
                </Badge>
              )}
            </div>
            {product.description && (
              <div className="text-xs text-muted-foreground line-clamp-1">{product.description}</div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'price',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 px-2"
          >
            Precio
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const product = row.original;
        return product.product_price?.price_ars ? (
          <div className="text-sm font-medium">
            {Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(product.product_price.price_ars)}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Sin precio</span>
        );
      },
      accessorFn: row => row.product_price?.price_ars ?? 0,
    },
    {
      accessorKey: 'stock',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 px-2"
          >
            Stock
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const product = row.original;
        const totalStock = getTotalStock(product);
        const lowStock = hasLowStock(product);
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm">{totalStock}</span>
            {lowStock && (
              <Badge variant="destructive" className="text-xs">
                Bajo
              </Badge>
            )}
          </div>
        );
      },
      accessorFn: row => getTotalStock(row),
    },
    {
      accessorKey: 'variants',
      header: 'Variantes',
      cell: ({ row }) => {
        const product = row.original;
        const variantCount = product.product_variants?.length || 0;
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{variantCount} variantes</span>
            {variantCount > 0 && onManageVariants && (
              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => onManageVariants(product)}>
                <Package className="mr-1 h-3 w-3" />
                Gestionar
              </Button>
            )}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: 'archived',
      header: 'Estado',
      cell: ({ row }) => {
        const product = row.original;
        return product.archived ? (
          <Badge variant="secondary">Archivado</Badge>
        ) : (
          <Badge variant="default">Activo</Badge>
        );
      },
      enableSorting: false,
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex gap-1">
            {onManageVariants && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onManageVariants(product)}
                disabled={isLoading}
                title="Gestionar variantes"
              >
                <Package className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(product)}
              disabled={isLoading}
              title="Editar producto"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDuplicate(product)}
              disabled={isLoading || duplicatingId === product.id}
              title="Duplicar producto"
            >
              {duplicatingId === product.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleArchive(product)}
              disabled={isLoading || archivingId === product.id}
              title={product.archived ? 'Desarchivar' : 'Archivar'}
            >
              {archivingId === product.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Archive className="h-4 w-4" />
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => openDeleteDialog(product)}
              disabled={isLoading || deletingId === product.id}
              title="Eliminar producto"
            >
              {deletingId === product.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 text-destructive" />
              )}
            </Button>
          </div>
        );
      },
      enableSorting: false,
    },
  ];

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    manualPagination: true,
    pageCount: Math.ceil(total / PAGE_SIZE),
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex: page,
        pageSize: PAGE_SIZE,
      },
    },
    onPaginationChange: updater => {
      if (typeof updater === 'function') {
        const newPagination = updater({ pageIndex: page, pageSize: PAGE_SIZE });
        setPage(newPagination.pageIndex);
      }
    },
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Productos</CardTitle>
          <CardDescription>Gestiona los productos de la tienda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por nombre, descripción o SKU..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setPage(0);
                }}
                className="pl-9 pr-9"
                disabled={isLoading}
              />
              {searchQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                  onClick={() => {
                    setSearchQuery('');
                    setPage(0);
                  }}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant={archivedFilter === undefined ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setArchivedFilter(undefined);
                  setPage(0);
                }}
              >
                Todos
              </Button>
              <Button
                variant={archivedFilter === false ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setArchivedFilter(false);
                  setPage(0);
                }}
              >
                Activos
              </Button>
              <Button
                variant={archivedFilter === true ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setArchivedFilter(true);
                  setPage(0);
                }}
              >
                Archivados
              </Button>
              <Button
                variant={lowStockFilter ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setLowStockFilter(!lowStockFilter);
                  setPage(0);
                }}
              >
                Stock Bajo
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Buscando...
                </span>
              ) : (
                <>
                  Mostrando {startItem}-{endItem} de {total} productos
                </>
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-md border">
            {isLoading && products.length === 0 ? (
              <div className="py-12 text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Cargando productos...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map(headerGroup => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map(header => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map(row => (
                      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                        {row.getVisibleCells().map(cell => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        {debouncedSearch || archivedFilter !== undefined || lowStockFilter
                          ? 'No se encontraron productos con ese criterio de búsqueda'
                          : 'No hay productos disponibles'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Página {page + 1} de {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage() || isLoading}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage() || isLoading}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={closeDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el producto{' '}
              <strong>{productToDelete?.name}</strong> y todas sus variantes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
