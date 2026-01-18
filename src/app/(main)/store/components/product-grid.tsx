'use client';

import { motion } from 'motion/react';
import type { ProductWithPrice } from '@/interface/product';
import { EmptyState } from './empty-state';
import { ProductCard } from './product-card';

interface ProductGridProps {
  products: ProductWithPrice[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return <EmptyState />;
  }

  return (
    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </motion.div>
  );
}
