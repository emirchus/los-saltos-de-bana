'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Loader2, Package, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { ProductVariant, ProductWithVariants } from '@/interface/product';
import {
  createProductVariant,
  deleteProductVariant,
  getProductVariants,
  updateProductVariant,
} from '../actions/products-admin-action';

const variantFormSchema = z.object({
  size: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  weight: z.number().min(0).nullable().optional(),
  sku: z.string().min(1, 'El SKU es requerido'),
  stock: z.number().min(0, 'El stock debe ser mayor o igual a 0').default(0),
  low_stock_threshold: z.number().min(0).nullable().optional(),
});

type VariantFormValues = z.infer<typeof variantFormSchema>;

interface VariantsManagerProps {
  product: ProductWithVariants;
  onUpdate?: () => void;
}

export function VariantsManager({ product, onUpdate }: VariantsManagerProps) {
  const [variants, setVariants] = useState<ProductVariant[]>(product.product_variants || []);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [variantToDelete, setVariantToDelete] = useState<ProductVariant | null>(null);

  const form = useForm<VariantFormValues>({
    resolver: zodResolver(variantFormSchema),
    defaultValues: {
      size: '',
      color: '',
      weight: null,
      sku: '',
      stock: 0,
      low_stock_threshold: null,
    },
  });

  const loadVariants = async () => {
    setIsLoading(true);
    try {
      const data = await getProductVariants(product.id);
      setVariants(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al cargar variantes');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: VariantFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingId) {
        // Actualizar variante existente
        await updateProductVariant(editingId, {
          size: values.size || null,
          color: values.color || null,
          weight: values.weight ?? null,
          sku: values.sku,
          stock: values.stock,
          low_stock_threshold: values.low_stock_threshold ?? null,
        });
        toast.success('Variante actualizada correctamente');
      } else {
        // Crear nueva variante
        await createProductVariant(product.id, {
          size: values.size || null,
          color: values.color || null,
          weight: values.weight ?? null,
          sku: values.sku,
          stock: values.stock,
          low_stock_threshold: values.low_stock_threshold ?? null,
        });
        toast.success('Variante creada correctamente');
      }

      form.reset();
      setEditingId(null);
      loadVariants();
      onUpdate?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al guardar variante');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (variant: ProductVariant) => {
    setEditingId(variant.id);
    form.reset({
      size: variant.size || '',
      color: variant.color || '',
      weight: variant.weight ?? null,
      sku: variant.sku,
      stock: variant.stock,
      low_stock_threshold: variant.low_stock_threshold ?? null,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    form.reset();
  };

  const handleDelete = async () => {
    if (!variantToDelete) return;

    try {
      await deleteProductVariant(variantToDelete.id);
      toast.success('Variante eliminada correctamente');
      setDeleteDialogOpen(false);
      setVariantToDelete(null);
      loadVariants();
      onUpdate?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar variante');
    }
  };

  const hasLowStock = (variant: ProductVariant): boolean => {
    const threshold = variant.low_stock_threshold ?? 10;
    return variant.stock <= threshold;
  };

  const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);
  const lowStockVariants = variants.filter(v => hasLowStock(v));

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {product.image && (
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg border">
                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                  </div>
                )}
                <div>
                  <CardTitle className="text-xl">{product.name}</CardTitle>
                  <CardDescription className="mt-1">
                    Gestiona las variantes (talle, color, peso, SKU) y su stock
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-4 mt-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{variants.length}</span> variantes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Stock total: <span className="font-medium text-foreground">{totalStock}</span>
                  </span>
                </div>
                {lowStockVariants.length > 0 && (
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="text-sm text-destructive">
                      <span className="font-medium">{lowStockVariants.length}</span> con stock bajo
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Talle</FormLabel>
                      <FormControl>
                        <Input placeholder="S, M, L, XL..." {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input placeholder="Rojo, Azul, Negro..." {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Peso (kg)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          value={field.value ?? ''}
                          onChange={e => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU *</FormLabel>
                      <FormControl>
                        <Input placeholder="SKU-001" {...field} disabled={!!editingId} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          value={field.value}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="low_stock_threshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Umbral de Stock Bajo</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="10"
                          {...field}
                          value={field.value ?? ''}
                          onChange={e => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingId ? 'Actualizar Variante' : 'Agregar Variante'}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </Form>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">Variantes Existentes</h3>
              {variants.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {variants.length} {variants.length === 1 ? 'variante' : 'variantes'}
                </span>
              )}
            </div>
            {isLoading ? (
              <div className="py-8 text-center">
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : variants.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <Package className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">No hay variantes creadas</p>
                <p className="text-xs text-muted-foreground">
                  Agrega variantes para gestionar diferentes talles, colores o versiones del producto
                </p>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {variants.map(variant => {
                  const isLowStock = hasLowStock(variant);
                  return (
                    <div
                      key={variant.id}
                      className={`rounded-lg border p-4 transition-colors ${
                        isLowStock
                          ? 'border-destructive/50 bg-destructive/5 hover:bg-destructive/10'
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-sm">{variant.sku}</span>
                            {isLowStock && (
                              <Badge variant="destructive" className="text-xs">
                                <AlertTriangle className="mr-1 h-3 w-3" />
                                Stock Bajo
                              </Badge>
                            )}
                          </div>
                          <div className="space-y-1">
                            {variant.size && (
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-muted-foreground">Talle:</span>
                                <span className="font-medium">{variant.size}</span>
                              </div>
                            )}
                            {variant.color && (
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-muted-foreground">Color:</span>
                                <span className="font-medium">{variant.color}</span>
                              </div>
                            )}
                            {variant.weight && (
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-muted-foreground">Peso:</span>
                                <span className="font-medium">{variant.weight} kg</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Stock:</span>
                            <span className={`text-sm font-semibold ${isLowStock ? 'text-destructive' : ''}`}>
                              {variant.stock}
                            </span>
                          </div>
                          {variant.low_stock_threshold && (
                            <span className="text-xs text-muted-foreground">Umbral: {variant.low_stock_threshold}</span>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(variant)}>
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setVariantToDelete(variant);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar variante?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la variante{' '}
              <strong>{variantToDelete?.sku}</strong>.
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
