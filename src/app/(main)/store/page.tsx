import { ShoppingCart } from 'lucide-react';
import { Suspense } from 'react';
import { CartSidebar } from '@/app/(main)/store/components/cart-sidebar';
import { StoreClient } from '@/app/(main)/store/components/store-client';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';

interface Props {
  searchParams: Promise<{
    search?: string;
    filter?: string;
  }>;
}

export default async function StorePage({ searchParams }: Props) {
  return (
    <div className="w-full h-full relative overflow-auto overflow-x-hidden">
      <SiteHeader title="Tienda">
        <div className="ml-auto flex items-center gap-2 mr-14">
          <CartSidebar />
        </div>
      </SiteHeader>
      <Suspense fallback={<div className="container mx-auto px-4 py-12 max-w-6xl relative z-10">Cargando...</div>}>
        <StoreClient />
      </Suspense>
    </div>
  );
}
