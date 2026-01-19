import { Shield } from 'lucide-react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { checkIsAdmin, getPermissions, getRoles, getUsersWithRoles } from './actions/roles-action';
import { RolesAdminClient } from './components/roles-admin-client';

export default async function AdminRolesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Verificar que el usuario esté autenticado
  if (!user) {
    redirect('/');
  }

  // Verificar que el usuario sea admin
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    redirect('/admin');
  }

  // Obtener datos
  const [users, roles, permissions] = await Promise.all([getUsersWithRoles(), getRoles(), getPermissions()]);

  return (
    <div className="w-full p-6 space-y-6 overflow-y-auto h-full">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Gestión de Roles y Permisos</h1>
            <p className="text-muted-foreground">
              Administra los roles de usuarios y visualiza los permisos del sistema
            </p>
          </div>
        </div>
      </div>

      <RolesAdminClient initialUsers={users} initialRoles={roles} initialPermissions={permissions} />
    </div>
  );
}
