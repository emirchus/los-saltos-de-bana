'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { ProductWithVariants } from '@/interface/product';
import { createProduct, updateProduct, updateProductPrice } from '../actions/products-admin-action';

const productFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().nullable().optional(),
  image: z.string().url('Debe ser una URL válida').nullable().optional().or(z.literal('')),
  price_ars: z.number().min(0, 'El precio debe ser mayor o igual a 0').nullable().optional(),
  price_promo_ars: z.number().min(0).nullable().optional(),
  price_wholesale_ars: z.number().min(0).nullable().optional(),
  price_points: z.number().min(0).nullable().optional(),
  price_star: z.number().min(0).nullable().optional(),
  quantity: z.number().min(0).nullable().optional(),
  low_stock_threshold: z.number().min(0).nullable().optional(),
  archived: z.boolean().optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: ProductWithVariants | null;
  onSuccess?: () => void;
}

export function ProductFormDialog({ open, onOpenChange, product, onSuccess }: ProductFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!product;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      image: product?.image || '',
      price_ars: product?.product_price?.price_ars ?? null,
      price_promo_ars: product?.product_price?.price_promo_ars ?? null,
      price_wholesale_ars: product?.product_price?.price_wholesale_ars ?? null,
      price_points: product?.product_price?.price_points ?? null,
      price_star: product?.product_price?.price_star ?? null,
      quantity: product?.quantity ?? null,
      low_stock_threshold: product?.low_stock_threshold ?? null,
      archived: product?.archived ?? false,
    },
  });

  const onSubmit = async (values: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditing && product) {
        // Actualizar producto
        await updateProduct(product.id, {
          name: values.name,
          description: values.description || null,
          image: values.image || null,
          quantity: values.quantity ?? null,
          low_stock_threshold: values.low_stock_threshold ?? null,
          archived: values.archived ?? false,
        });

        // Actualizar precios si existe price_id
        if (product.price_id) {
          await updateProductPrice(product.price_id, {
            price_ars: values.price_ars ?? null,
            price_promo_ars: values.price_promo_ars ?? null,
            price_wholesale_ars: values.price_wholesale_ars ?? null,
            price_points: values.price_points ?? null,
            price_star: values.price_star ?? null,
          });
        }

        toast.success('Producto actualizado correctamente');
      } else {
        // Crear producto
        await createProduct({
          name: values.name,
          description: values.description || null,
          image: values.image || null,
          price_ars: values.price_ars ?? null,
          price_promo_ars: values.price_promo_ars ?? null,
          price_wholesale_ars: values.price_wholesale_ars ?? null,
          price_points: values.price_points ?? null,
          price_star: values.price_star ?? null,
          quantity: values.quantity ?? null,
          low_stock_threshold: values.low_stock_threshold ?? null,
          archived: values.archived ?? false,
        });

        toast.success('Producto creado correctamente');
      }

      form.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al guardar producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Modifica la información del producto' : 'Completa la información del nuevo producto'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del producto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descripción del producto" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de Imagen</FormLabel>
                  <FormControl>
                    <Input placeholder="https://ejemplo.com/imagen.jpg" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
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

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Precios</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price_ars"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio Normal (ARS)</FormLabel>
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
                  name="price_promo_ars"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio Promo (ARS)</FormLabel>
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
                  name="price_points"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio en Puntos</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
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
                  name="price_star"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio en Estrellas</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
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
            </div>

            <FormField
              control={form.control}
              name="archived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Archivado</FormLabel>
                    <div className="text-sm text-muted-foreground">El producto no aparecerá en la tienda pública</div>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
