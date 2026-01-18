'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Heart, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { addToCart } from '@/app/(main)/store/actions/cart-action';
import { useFavorites } from '@/app/(main)/store/hooks/use-favorites';
import { ProductWithPrice } from '@/interface/product';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: ProductWithPrice;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const queryClient = useQueryClient();
  const favorite = isFavorite(product.id);

  const handleAddToCart = async () => {
    if (isAddingToCart) return;

    setIsAddingToCart(true);
    try {
      await addToCart(product.id, 1);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
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
            className="object-contain relative z-10 group-hover:scale-105 transition-transform duration-300 rounded-md aspect-square"
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
              className="inline-block px-3 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-md"
            >
              {Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price.price_ars || 0)}
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
            className="p-2 bg-secondary/80 backdrop-blur-sm rounded-lg text-foreground hover:text-primary transition-colors"
            onClick={() => toggleFavorite(product.id)}
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
            className="p-2 bg-secondary/80 backdrop-blur-sm rounded-lg text-foreground hover:text-primary transition-colors"
            onClick={handleAddToCart}
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
