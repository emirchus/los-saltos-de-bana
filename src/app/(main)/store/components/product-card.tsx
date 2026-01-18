'use client';

import { Heart, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { ProductWithPrice } from '@/interface/product';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/stores/cart.store';
import { useFavoritesStore } from '@/stores/favorites.store';

interface ProductCardProps {
  product: ProductWithPrice;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const addItem = useCartStore(state => state.addItem);

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const favorite = isFavorite(product.id);

  const handleAddToCart = () => {
    if (isAddingToCart) return;

    setIsAddingToCart(true);
    try {
      addItem(product, 1);
      toast.success('Producto agregado al carrito');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al agregar al carrito');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const price = product.product_price;
  const hasStock = product.quantity === null || product.quantity > 0;

  return (
    <Link href={`/store/${product.id}`} prefetch>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        whileHover={{ scale: 1.02, y: -5 }}
        className={cn(
          'group corner-squircle relative bg-card rounded-4xl overflow-hidden border border-border hover:border-primary/60 transition-colors',
          {
            'opacity-50': !hasStock,
            'border-destructive': !hasStock,
            'cursor-not-allowed': !hasStock,
            'pointer-events-none': !hasStock,
          }
        )}
      >
        <div className="relative aspect-square p-4 flex items-center justify-center bg-linear-to-b from-secondary/50 to-transparent">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Image
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            width={1500}
            height={1500}
            className="object-cover relative z-10 group-hover:scale-105 transition-transform duration-300 rounded-md aspect-square"
            style={{
              viewTransitionName: `product-image-${product.id}`,
            }}
          />
        </div>

        <div className="p-4 space-y-2">
          {price && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-row gap-4 items-center justify-center px-3 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-md"
            >
              {price.price_ars && (
                <span>
                  {Intl.NumberFormat('es-AR', {
                    style: 'currency',
                    currency: 'ARS',
                  }).format(price.price_ars || 0)}
                </span>
              )}
              {price.price_points && <span>PTS{Intl.NumberFormat('es-AR').format(price.price_points || 0)}</span>}
              {price.price_star && <span>⭐{Intl.NumberFormat('es-AR').format(price.price_star || 0)}</span>}
            </motion.div>
          )}
          <p
            className="text-foreground/80 text-sm line-clamp-2"
            style={{
              viewTransitionName: `product-name-${product.id}`,
            }}
          >
            {product.name}
          </p>
        </div>
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-secondary/80 backdrop-blur-sm rounded-lg text-foreground hover:text-primary transition-colors relative pointer-events-auto cursor-pointer"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(product.id);
            }}
          >
            <Heart
              className={cn('size-4', {
                'fill-primary': favorite,
              })}
            />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-secondary/80 backdrop-blur-sm rounded-lg text-foreground hover:text-primary transition-colors relative pointer-events-auto cursor-pointer"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart();
            }}
          >
            <ShoppingCart
              className={cn('size-4', {
                'fill-primary': isAddingToCart,
              })}
            />
          </motion.button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.div>
    </Link>
  );
}
