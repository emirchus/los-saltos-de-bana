'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ProductWithVariants } from '@/interface/product';
import type { GetProductsAdminResult } from '../actions/products-admin-action';
import { useProductForm, useProductsAdmin, useVariantsManager } from '../hooks';
import { LowStockAlerts } from './low-stock-alerts';
import { ProductFormDialog } from './product-form-dialog';
import { ProductsAdminTable } from './products-admin-table';
import { VariantsManager } from './variants-manager';

interface StoreAdminClientProps {
  initialProducts: GetProductsAdminResult;
}

export function StoreAdminClient({ initialProducts }: StoreAdminClientProps) {
  const [activeTab, setActiveTab] = useState('products');
  const [refreshKey, setRefreshKey] = useState(0);

  const { products, refreshProducts } = useProductsAdmin(initialProducts);
  const productForm = useProductForm();
  const variantsManager = useVariantsManager();

  const handleFormSuccess = async () => {
    await refreshProducts();
    setRefreshKey(prev => prev + 1);
    productForm.handleSuccess();
  };

  const handleManageVariants = (product: ProductWithVariants) => {
    variantsManager.selectProduct(product);
    setActiveTab('variants');
  };

  const handleProductClick = (productId: number) => {
    const product = products.products.find(p => p.id === productId);
    if (product) {
      handleManageVariants(product);
    }
  };

  const handleVariantsUpdate = async () => {
    await refreshProducts();
    await variantsManager.refreshSelectedProduct();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Administrador de Tienda</h1>
          <p className="text-muted-foreground">Gestiona productos, variantes, precios y stock</p>
        </div>
        <Button onClick={productForm.openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="variants">
            Variantes
            {variantsManager.selectedProduct && ` - ${variantsManager.selectedProduct.name}`}
          </TabsTrigger>
          <TabsTrigger value="alerts">Alertas de Stock</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <ProductsAdminTable
            initialProducts={products}
            onEdit={productForm.openEdit}
            onManageVariants={handleManageVariants}
            refreshKey={refreshKey}
          />
        </TabsContent>

        <TabsContent value="variants" className="space-y-4">
          {variantsManager.selectedProduct ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Gestionar Variantes</h2>
                  <p className="text-sm text-muted-foreground">{variantsManager.selectedProduct.name}</p>
                </div>
                <Button variant="outline" onClick={() => variantsManager.clearSelection()}>
                  Volver a Productos
                </Button>
              </div>
              <VariantsManager product={variantsManager.selectedProduct} onUpdate={handleVariantsUpdate} />
            </div>
          ) : (
            <div className="rounded-lg border p-8 text-center">
              <p className="text-muted-foreground">Selecciona un producto para gestionar sus variantes</p>
              <Button className="mt-4" onClick={() => setActiveTab('products')}>
                Ver Productos
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <LowStockAlerts onProductClick={handleProductClick} />
        </TabsContent>
      </Tabs>

      {productForm.isOpen && (
        <ProductFormDialog
          open={productForm.isOpen}
          onOpenChange={productForm.close}
          product={productForm.editingProduct}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
