'use client';

import { ChevronLeft, ChevronRight, Loader2, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import type { getUsers, UserStats } from '../actions/users-action';
import { updateUserStats } from '../actions/users-action';

interface UsersTableProps {
  initialUsers: Awaited<ReturnType<typeof getUsers>>;
  channel?: string;
}

const PAGE_SIZE = 20;

export function UsersTable({ initialUsers, channel }: UsersTableProps) {
  const [users, setUsers] = useState(initialUsers.users);
  const [total, setTotal] = useState(initialUsers.total);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState<{ points: number; stars: number } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Debounce para la búsqueda (500ms de delay)
  const debouncedSearch = useDebounce(searchQuery, 500);
  const isFirstRender = useRef(true);

  // Resetear a la primera página cuando cambia la búsqueda debounced
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Cargar usuarios cuando cambia la búsqueda o la página
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const { getUsers } = await import('../actions/users-action');
        const result = await getUsers({
          channel,
          search: debouncedSearch.trim() || undefined,
          page,
          pageSize: PAGE_SIZE,
        });
        setUsers(result.users);
        setTotal(result.total);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Error al cargar usuarios');
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [debouncedSearch, page, channel]);

  const getEditKey = (userId: string, userChannel: string) => `${userId}-${userChannel}`;

  const handleEdit = (user: UserStats) => {
    setEditingKey(getEditKey(user.user_id, user.channel));
    setEditedUser({ points: user.points, stars: user.stars });
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditedUser(null);
  };

  const handleSave = async (userId: string, userChannel: string) => {
    if (!editedUser) return;

    setIsSaving(true);
    try {
      const updated = await updateUserStats(userId, userChannel, editedUser);
      setUsers(users.map(u => (u.user_id === userId && u.channel === userChannel ? updated : u)));
      setEditingKey(null);
      setEditedUser(null);
      toast.success('Usuario actualizado correctamente');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al actualizar el usuario');
    } finally {
      setIsSaving(false);
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const startItem = page * PAGE_SIZE + 1;
  const endItem = Math.min((page + 1) * PAGE_SIZE, total);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuarios</CardTitle>
        <CardDescription>
          Edita los puntos y estrellas de los usuarios{channel ? ` del canal ${channel}` : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por usuario, ID o canal..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-9"
              disabled={isLoading}
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                onClick={() => setSearchQuery('')}
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Buscando...
                </span>
              ) : (
                <>
                  Mostrando {startItem}-{endItem} de {total} usuarios
                </>
              )}
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          {isLoading && users.length === 0 ? (
            <div className="py-12 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Cargando usuarios...</p>
            </div>
          ) : (
            <>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left text-sm font-medium">Usuario</th>
                    <th className="p-2 text-left text-sm font-medium">Canal</th>
                    <th className="p-2 text-left text-sm font-medium">Puntos</th>
                    <th className="p-2 text-left text-sm font-medium">Estrellas</th>
                    <th className="p-2 text-left text-sm font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => {
                    const editKey = getEditKey(user.user_id, user.channel);
                    const isEditing = editingKey === editKey;
                    const currentPoints = isEditing && editedUser ? editedUser.points : user.points;
                    const currentStars = isEditing && editedUser ? editedUser.stars : user.stars;

                    return (
                      <tr key={`${user.user_id}-${user.channel}`} className="border-b hover:bg-muted/50">
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.profile_pic || undefined} alt={user.username} />
                              <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.username}</span>
                          </div>
                        </td>
                        <td className="p-2 text-sm text-muted-foreground">{user.channel}</td>
                        <td className="p-2">
                          {isEditing ? (
                            <Input
                              type="number"
                              value={currentPoints}
                              onChange={e =>
                                setEditedUser({
                                  ...editedUser!,
                                  points: Number(e.target.value),
                                })
                              }
                              className="w-24"
                            />
                          ) : (
                            <span>{user.points}</span>
                          )}
                        </td>
                        <td className="p-2">
                          {isEditing ? (
                            <Input
                              type="number"
                              value={currentStars}
                              onChange={e =>
                                setEditedUser({
                                  ...editedUser!,
                                  stars: Number(e.target.value),
                                })
                              }
                              className="w-24"
                            />
                          ) : (
                            <span>{user.stars}</span>
                          )}
                        </td>
                        <td className="p-2">
                          {isEditing ? (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleSave(user.user_id, user.channel)}
                                disabled={isSaving}
                              >
                                {isSaving ? 'Guardando...' : 'Guardar'}
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleCancel}>
                                Cancelar
                              </Button>
                            </div>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>
                              Editar
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {users.length === 0 && !isLoading && (
                <div className="py-8 text-center text-muted-foreground">
                  {debouncedSearch
                    ? 'No se encontraron usuarios con ese criterio de búsqueda'
                    : 'No hay usuarios disponibles'}
                </div>
              )}
            </>
          )}
        </div>
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Página {page + 1} de {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0 || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1 || isLoading}
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
