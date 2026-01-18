'use client';

import { ArrowLeft, Heart, Minus, Package, Plus, RotateCcw, Shield, ShoppingCart, Truck } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ProductWithPrice } from '@/interface/product';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/stores/cart.store';
import { useFavoritesStore } from '@/stores/favorites.store';

interface ProductDetailClientProps {
  product: ProductWithPrice;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const addItem = useCartStore(state => state.addItem);

  const favorite = isFavorite(product.id);
  const price = product.product_price;
  const hasStock = product.quantity === null || product.quantity > 0;
  const maxQuantity = product.quantity ?? 999;

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = () => {
    if (isAddingToCart || !hasStock) return;

    setIsAddingToCart(true);
    try {
      addItem(product, quantity);
      toast.success('Producto agregado al carrito');
      setQuantity(1); // Resetear cantidad después de agregar
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al agregar al carrito');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const totalPrice = price ? (price.price_ars || 0) * quantity : 0;

  return (
    <div className="h-full">
      <div className="container mx-auto px-4 py-6">
        {/* Navegación */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Link
            href="/store"
            className="inline-flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver a la tienda</span>
          </Link>
        </motion.div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-8 lg:gap-12">
          {/* Sección izquierda: Imagen */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="relative aspect-square bg-card rounded-2xl border border-border overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
              <Image
                src={product.image || '/placeholder.svg'}
                alt={product.name}
                fill
                className="object-cover p-8 group-hover:scale-105 transition-transform duration-500 rounded-2xl corner-squircle"
                style={{
                  viewTransitionName: `product-image-${product.id}`,
                }}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute top-4 right-4 p-3 bg-secondary/80 backdrop-blur-sm rounded-xl text-foreground hover:text-primary transition-colors cursor-pointer"
                onClick={() => toggleFavorite(product.id)}
              >
                <Heart
                  className={cn('w-6 h-6', {
                    'fill-primary': favorite,
                  })}
                />
              </motion.button>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-primary to-transparent" />
            </div>
          </motion.div>

          {/* Sección derecha: Detalles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-primary text-sm font-medium uppercase tracking-wider"
              >
                LLEVEN
              </motion.span>
              <h1
                className="text-3xl lg:text-4xl font-bold text-foreground mt-2 text-balance"
                style={{
                  viewTransitionName: `product-name-${product.id}`,
                }}
              >
                {product.name}
              </h1>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col gap-4 items-start justify-start"
            >
              <span className="text-2xl lg:text-3xl font-bold text-foreground">
                {Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price.price_ars || 0)}
              </span>

              {price.price_points && (
                <span className="text-2xl lg:text-3xl font-bold text-primary">
                  PTS {Intl.NumberFormat('es-AR').format(price.price_star || 0)}
                </span>
              )}

              {price.price_star && (
                <span className="text-2xl lg:text-3xl font-bold text-yellow-400">
                  ⭐ {Intl.NumberFormat('es-AR').format(price.price_star || 0)}
                </span>
              )}
            </motion.div>

            <p className="text-foreground/70 text-lg leading-relaxed">{product.description}</p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-foreground/70">Cantidad:</span>
              <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDecrease}
                  className="p-2 text-foreground hover:text-primary transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </motion.button>
                <span className="w-12 text-center text-foreground font-bold text-lg">{quantity}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleIncrease}
                  className="p-2 text-foreground hover:text-primary transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-3 bg-primary text-primary-foreground font-bold text-lg py-4 px-8 rounded-xl hover:bg-primary/90 transition-colors"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-6 h-6" />
              Agregar al carrito -{' '}
              {Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(totalPrice)}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
