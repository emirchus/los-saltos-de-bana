'use client';

import { Shield, ShieldCheck, User, UserCog } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { assignRoleToUser, type UserWithRole } from '../actions/roles-action';

interface UsersRolesTableProps {
  users: UserWithRole[];
  roles: Array<{ id: string; name: string; role_type: string }>;
  onRoleUpdated?: () => void;
}

const roleIcons = {
  super_admin: ShieldCheck,
  admin: Shield,
  moderator: UserCog,
  user: User,
};

const roleColors = {
  super_admin: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  admin: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  moderator: 'bg-green-500/10 text-green-700 dark:text-green-400',
  user: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
};

export function UsersRolesTable({ users, roles, onRoleUpdated }: UsersRolesTableProps) {
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenDialog = (user: UserWithRole) => {
    setSelectedUser(user);
    setSelectedRole(user.role_id || 'user');
    setIsDialogOpen(true);
  };

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) return;

    setIsLoading(true);
    try {
      await assignRoleToUser(selectedUser.user_id, selectedRole);
      toast.success('Rol asignado correctamente', {
        description: `El rol ha sido actualizado para ${selectedUser.username || selectedUser.email}`,
      });
      setIsDialogOpen(false);
      onRoleUpdated?.();
    } catch (error) {
      toast.error('Error al asignar rol', {
        description: error instanceof Error ? error.message : 'Ocurrió un error inesperado',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol Actual</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No hay usuarios
                </TableCell>
              </TableRow>
            ) : (
              users.map(user => {
                const RoleIcon = user.role_type ? roleIcons[user.role_type] : User;
                const roleColor = user.role_type ? roleColors[user.role_type] : roleColors.user;

                return (
                  <TableRow key={user.user_id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{user.username || user.full_name || 'Sin nombre'}</span>
                        {user.full_name && user.username && (
                          <span className="text-xs text-muted-foreground">{user.full_name}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{user.email || '-'}</TableCell>
                    <TableCell>
                      <Badge className={roleColor} variant="outline">
                        <RoleIcon className="mr-1 h-3 w-3" />
                        {user.role_name || 'Usuario'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleOpenDialog(user)}>
                        Cambiar Rol
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar Rol de Usuario</DialogTitle>
            <DialogDescription>
              Selecciona un nuevo rol para {selectedUser?.username || selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rol</label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button onClick={handleAssignRole} disabled={isLoading || !selectedRole}>
              {isLoading ? 'Asignando...' : 'Asignar Rol'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
