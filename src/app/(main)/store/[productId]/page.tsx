import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getProductById } from '@/app/(main)/store/actions/products-action';
import { CartSidebar } from '@/app/(main)/store/components/cart-sidebar';
import { SiteHeader } from '@/components/site-header';
import { ProductDetailClient } from './components/product-detail-client';

interface Props {
  params: Promise<{
    productId: string;
  }>;
}

export async function generateMetadata({ params }: Props) {
  const { productId } = await params;
  if (!productId || isNaN(Number(productId))) {
    return {
      title: 'Producto no encontrado',
    };
  }

  const product = await getProductById(Number(productId));
  if (!product) {
    return {
      title: 'Producto no encontrado',
    };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image || ''],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { productId } = await params;
  if (!productId || isNaN(Number(productId))) {
    notFound();
  }
  const product = await getProductById(Number(productId));

  if (!product) {
    notFound();
  }

  return (
    <div className="w-full h-full relative overflow-auto overflow-x-hidden">
      <SiteHeader title={product.name}>
        <div className="ml-auto flex items-center gap-2 mr-14">
          <CartSidebar />
        </div>
      </SiteHeader>
      <Suspense fallback={<div className="container mx-auto px-4 py-12 max-w-6xl relative z-10">Cargando...</div>}>
        <ProductDetailClient product={product} />
      </Suspense>
    </div>
  );
}
