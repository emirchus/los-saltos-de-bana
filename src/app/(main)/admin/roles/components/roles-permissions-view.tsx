'use client';

import { Shield, ShieldCheck, User, UserCog } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Permission, Role } from '../actions/roles-action';

interface RolesPermissionsViewProps {
  roles: Role[];
  permissions: Permission[];
}

const roleIcons = {
  super_admin: ShieldCheck,
  admin: Shield,
  moderator: UserCog,
  user: User,
};

const roleColors = {
  super_admin: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  admin: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  moderator: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
  user: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800',
};

// Agrupar permisos por recurso
function groupPermissionsByResource(permissions: Permission[]) {
  const grouped: Record<string, Permission[]> = {};
  permissions.forEach(perm => {
    if (!grouped[perm.resource]) {
      grouped[perm.resource] = [];
    }
    grouped[perm.resource].push(perm);
  });
  return grouped;
}

export function RolesPermissionsView({ roles, permissions }: RolesPermissionsViewProps) {
  const groupedPermissions = groupPermissionsByResource(permissions);

  return (
    <Tabs defaultValue="roles" className="space-y-4">
      <TabsList>
        <TabsTrigger value="roles">Roles y Permisos</TabsTrigger>
        <TabsTrigger value="permissions">Todos los Permisos</TabsTrigger>
      </TabsList>

      <TabsContent value="roles" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {roles.map(role => {
            const RoleIcon = roleIcons[role.role_type];
            const roleColor = roleColors[role.role_type];

            return (
              <Card key={role.id} className={roleColor}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RoleIcon className="h-5 w-5" />
                    {role.name}
                    {role.is_system && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        Sistema
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{role.description || 'Sin descripción'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Permisos ({role.permissions.length}):</div>
                    <div className="h-48 overflow-y-auto">
                      <div className="space-y-1">
                        {role.permissions.length === 0 ? (
                          <p className="text-sm text-muted-foreground">Sin permisos asignados</p>
                        ) : (
                          Object.entries(groupPermissionsByResource(role.permissions)).map(([resource, perms]) => (
                            <div key={resource} className="space-y-1">
                              <div className="text-xs font-semibold text-muted-foreground uppercase">{resource}</div>
                              {perms.map(perm => (
                                <div key={perm.id} className="text-xs ml-2">
                                  • {perm.name}
                                </div>
                              ))}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </TabsContent>

      <TabsContent value="permissions" className="space-y-4">
        <div className="space-y-4">
          {Object.entries(groupedPermissions).map(([resource, perms]) => (
            <Card key={resource}>
              <CardHeader>
                <CardTitle className="text-lg capitalize">{resource}</CardTitle>
                <CardDescription>{perms.length} permiso(s)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                  {perms.map(perm => (
                    <div key={perm.id} className="p-3 border rounded-lg">
                      <div className="font-medium text-sm">{perm.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{perm.description || 'Sin descripción'}</div>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {perm.action}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
