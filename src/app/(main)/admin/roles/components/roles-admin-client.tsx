'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Permission, Role, UserWithRole } from '../actions/roles-action';
import { RolesPermissionsView } from './roles-permissions-view';
import { UsersRolesTable } from './users-roles-table';

interface RolesAdminClientProps {
  initialUsers: UserWithRole[];
  initialRoles: Role[];
  initialPermissions: Permission[];
}

export function RolesAdminClient({ initialUsers, initialRoles, initialPermissions }: RolesAdminClientProps) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);

  const handleRoleUpdated = () => {
    // Refrescar la página para obtener los datos actualizados
    router.refresh();
  };

  // Preparar roles para el selector
  const rolesForSelector = initialRoles.map(r => ({
    id: r.id,
    name: r.name,
    role_type: r.role_type,
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Usuarios y Roles</CardTitle>
          <CardDescription>
            Asigna y modifica los roles de los usuarios del sistema. Total: {users.length} usuario(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsersRolesTable users={users} roles={rolesForSelector} onRoleUpdated={handleRoleUpdated} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Roles y Permisos del Sistema</CardTitle>
          <CardDescription>Visualiza todos los roles disponibles y los permisos asociados a cada uno</CardDescription>
        </CardHeader>
        <CardContent>
          <RolesPermissionsView roles={initialRoles} permissions={initialPermissions} />
        </CardContent>
      </Card>
    </div>
  );
}
