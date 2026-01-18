'use client';

import { Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useCartStore } from '@/stores/cart.store';
import { purchaseCart } from '../actions/cart-action';

interface CartSidebarProps {
  children?: React.ReactNode;
}

export function CartSidebar({ children }: CartSidebarProps) {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const items = useCartStore(state => state.items);
  const removeItem = useCartStore(state => state.removeItem);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const getItemCount = useCartStore(state => state.getItemCount);
  const getTotalPoints = useCartStore(state => state.getTotalPoints);
  const getTotalStars = useCartStore(state => state.getTotalStars);
  const getTotalARS = useCartStore(state => state.getTotalARS);

  const itemCount = getItemCount();
  const totalPoints = getTotalPoints();
  const totalStars = getTotalStars();
  const totalARS = getTotalARS();

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }

    try {
      updateQuantity(itemId, newQuantity);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al actualizar cantidad');
    }
  };

  const handleRemoveItem = (itemId: string) => {
    try {
      removeItem(itemId);
      toast.success('Producto eliminado del carrito');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar producto');
    }
  };

  const clearCart = useCartStore(state => state.clearCart);

  const handlePurchase = async () => {
    if (isPurchasing || items.length === 0) return;

    setIsPurchasing(true);
    try {
      // Preparar los items del carrito para la compra
      const cartItems = items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      await purchaseCart(cartItems);
      
      // Limpiar el carrito después de la compra exitosa
      clearCart();
      
      toast.success('Compra realizada exitosamente');
      setIsOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al procesar la compra');
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button variant="outline" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                {itemCount}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Carrito de Compras</SheetTitle>
          <SheetDescription>
            {itemCount === 0 ? 'Tu carrito está vacío' : `${itemCount} ${itemCount === 1 ? 'producto' : 'productos'}`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <AnimatePresence mode="sync">
            {items.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <ShoppingCart className="mb-4 h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground">No hay productos en tu carrito</p>
              </motion.div>
            ) : (
              <motion.div
                key="items"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <AnimatePresence mode="popLayout">
                  {items.map(item => {
                    const product = item.product;
                    const price = product.product_price;

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, x: -100 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                      >
                        {/* Imagen */}
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
                          {product.image ? (
                            <Image src={product.image} alt={product.name} fill className="object-cover" sizes="80px" />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                              Sin imagen
                            </div>
                          )}
                        </div>

                        {/* Información */}
                        <div className="flex flex-1 flex-col gap-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="line-clamp-2 text-sm font-medium">{product.name}</h4>
                              <div className="mt-1 flex flex-col gap-1">
                                {price?.price_points && (
                                  <span className="text-xs text-green-400">
                                    ${(price.price_points * item.quantity).toLocaleString()} pts
                                  </span>
                                )}
                                {price?.price_star && (
                                  <span className="text-xs text-yellow-400">
                                    ⭐ {(price.price_star * item.quantity).toLocaleString()} stars
                                  </span>
                                )}
                                {price?.price_ars && (
                                  <span className="text-xs text-muted-foreground">
                                    ${(price.price_ars * item.quantity).toLocaleString()} ARS
                                  </span>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Controles de cantidad */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={e => {
                                const value = parseInt(e.target.value, 10);
                                if (!isNaN(value) && value > 0) {
                                  handleUpdateQuantity(item.id, value);
                                }
                              }}
                              className="h-8 w-16 text-center"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Footer con totales y botón de comprar */}
        {items.length > 0 && (
          <div className="border-t pt-4">
            <div className="mb-4 space-y-2">
              {totalPoints > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-between text-sm"
                >
                  <span className="text-muted-foreground">Total Points:</span>
                  <span className="font-semibold text-green-400">${totalPoints.toLocaleString()}</span>
                </motion.div>
              )}
              {totalStars > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-between text-sm"
                >
                  <span className="text-muted-foreground">Total Stars:</span>
                  <span className="font-semibold text-yellow-400">⭐ {totalStars.toLocaleString()}</span>
                </motion.div>
              )}
              {totalARS > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-between text-sm"
                >
                  <span className="text-muted-foreground">Total ARS:</span>
                  <span className="font-semibold">${totalARS.toLocaleString()}</span>
                </motion.div>
              )}
            </div>
            <Button
              onClick={handlePurchase}
              disabled={isPurchasing}
              className="w-full bg-green-600 shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-all hover:bg-green-700 hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] disabled:opacity-50"
            >
              {isPurchasing ? 'Procesando...' : 'Comprar'}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
