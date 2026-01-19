import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getProductsAdmin } from './actions/products-admin-action';
import { StoreAdminClient } from './components/store-admin-client';

export default async function AdminStorePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Verificar que el usuario esté autenticado
  if (!user) {
    redirect('/');
  }

  // Obtener productos iniciales
  const initialProducts = await getProductsAdmin({ page: 0, pageSize: 20 });

  return (
    <div className="w-full p-6 space-y-6 overflow-y-auto h-full">
      <StoreAdminClient initialProducts={initialProducts} />
    </div>
  );
}
