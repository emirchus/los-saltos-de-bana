'use client';

import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Loader2, Radio, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { getActiveSession } from '../actions/session-action';
import type { getUsers, UserWithSession } from '../actions/users-action';
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
  const [editingGlobalKey, setEditingGlobalKey] = useState<string | null>(null);
  const [editingSessionKey, setEditingSessionKey] = useState<string | null>(null);
  const [editedGlobal, setEditedGlobal] = useState<{ points: number; stars: number } | null>(null);
  const [editedSession, setEditedSession] = useState<{ points: number } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSessions, setActiveSessions] = useState<
    Record<string, { id: string; is_live: boolean; started_at: string } | null>
  >({});

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

        // Cargar sesiones activas para cada canal único
        const uniqueChannels = [...new Set(result.users.map(u => u.channel))];
        const sessionsMap: Record<string, { id: string; is_live: boolean; started_at: string } | null> = {};

        await Promise.all(
          uniqueChannels.map(async ch => {
            const session = await getActiveSession(ch);
            if (session) {
              sessionsMap[ch] = {
                id: session.id,
                is_live: session.is_live,
                started_at: session.started_at,
              };
            } else {
              sessionsMap[ch] = null;
            }
          })
        );

        setActiveSessions(sessionsMap);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Error al cargar usuarios');
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [debouncedSearch, page, channel]);

  const getEditKey = (userId: string, userChannel: string) => `${userId}-${userChannel}`;

  const handleEditGlobal = (user: UserWithSession) => {
    setEditingGlobalKey(getEditKey(user.user_id, user.channel));
    setEditedGlobal({ points: user.points, stars: user.stars });
  };

  const handleEditSession = (user: UserWithSession) => {
    setEditingSessionKey(getEditKey(user.user_id, user.channel));
    setEditedSession({
      points: user.sessionStats?.points || 0,
    });
  };

  const handleCancelGlobal = () => {
    setEditingGlobalKey(null);
    setEditedGlobal(null);
  };

  const handleCancelSession = () => {
    setEditingSessionKey(null);
    setEditedSession(null);
  };

  const handleSaveGlobal = async (userId: string, userChannel: string) => {
    if (!editedGlobal) return;

    setIsSaving(true);
    try {
      const updated = await updateUserStats(userId, userChannel, editedGlobal, 'global');
      setUsers(users.map(u => (u.user_id === userId && u.channel === userChannel ? { ...u, ...updated } : u)));
      setEditingGlobalKey(null);
      setEditedGlobal(null);
      toast.success('Puntos/estrellas globales actualizados correctamente');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al actualizar el usuario');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSession = async (userId: string, userChannel: string) => {
    if (!editedSession) return;

    setIsSaving(true);
    try {
      await updateUserStats(userId, userChannel, { points: editedSession.points }, 'session');
      // Recargar usuarios para obtener los datos actualizados de sesión
      const { getUsers } = await import('../actions/users-action');
      const result = await getUsers({
        channel,
        search: debouncedSearch.trim() || undefined,
        page,
        pageSize: PAGE_SIZE,
      });
      setUsers(result.users);

      // Recargar también las sesiones activas
      const uniqueChannels = [...new Set(result.users.map(u => u.channel))];
      const sessionsMap: Record<string, { id: string; is_live: boolean; started_at: string } | null> = {};

      await Promise.all(
        uniqueChannels.map(async ch => {
          const session = await getActiveSession(ch);
          if (session) {
            sessionsMap[ch] = {
              id: session.id,
              is_live: session.is_live,
              started_at: session.started_at,
            };
          } else {
            sessionsMap[ch] = null;
          }
        })
      );

      setActiveSessions(sessionsMap);
      setEditingSessionKey(null);
      setEditedSession(null);
      toast.success('Puntos de sesión actualizados correctamente (también se actualizaron los puntos globales)');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al actualizar la sesión');
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
                    <th className="p-2 text-left text-sm font-medium">Puntos Global</th>
                    <th className="p-2 text-left text-sm font-medium">Estrellas Global</th>
                    <th className="p-2 text-left text-sm font-medium">Puntos Sesión</th>
                    <th className="p-2 text-left text-sm font-medium">Sesión Activa</th>
                    <th className="p-2 text-left text-sm font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => {
                    const editKey = getEditKey(user.user_id, user.channel);
                    const isEditingGlobal = editingGlobalKey === editKey;
                    const isEditingSession = editingSessionKey === editKey;
                    const currentGlobalPoints = isEditingGlobal && editedGlobal ? editedGlobal.points : user.points;
                    const currentGlobalStars = isEditingGlobal && editedGlobal ? editedGlobal.stars : user.stars;
                    const currentSessionPoints =
                      isEditingSession && editedSession ? editedSession.points : (user.sessionStats?.points ?? 0);

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
                          {isEditingGlobal ? (
                            <Input
                              type="number"
                              value={currentGlobalPoints}
                              onChange={e =>
                                setEditedGlobal({
                                  ...editedGlobal!,
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
                          {isEditingGlobal ? (
                            <Input
                              type="number"
                              value={currentGlobalStars}
                              onChange={e =>
                                setEditedGlobal({
                                  ...editedGlobal!,
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
                          {isEditingSession ? (
                            <Input
                              type="number"
                              value={currentSessionPoints}
                              onChange={e =>
                                setEditedSession({
                                  ...editedSession!,
                                  points: Number(e.target.value),
                                })
                              }
                              className="w-24"
                            />
                          ) : (
                            <span>{user.sessionStats?.points ?? '-'}</span>
                          )}
                        </td>
                        <td className="p-2">
                          {activeSessions[user.channel] ? (
                            <div className="flex flex-col gap-1">
                              <Badge
                                variant={activeSessions[user.channel]?.is_live ? 'default' : 'secondary'}
                                className="w-fit flex items-center gap-1"
                              >
                                <Radio className="h-3 w-3" />
                                {activeSessions[user.channel]?.is_live ? 'En vivo' : 'Última sesión'}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(activeSessions[user.channel]!.started_at), 'dd/MM/yyyy HH:mm')}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">Sin sesión</span>
                          )}
                        </td>
                        <td className="p-2">
                          <div className="flex flex-col gap-2">
                            {isEditingGlobal ? (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveGlobal(user.user_id, user.channel)}
                                  disabled={isSaving}
                                >
                                  {isSaving ? 'Guardando...' : 'Guardar Global'}
                                </Button>
                                <Button size="sm" variant="outline" onClick={handleCancelGlobal}>
                                  Cancelar
                                </Button>
                              </div>
                            ) : (
                              <Button size="sm" variant="outline" onClick={() => handleEditGlobal(user)}>
                                Editar Global
                              </Button>
                            )}
                            {isEditingSession ? (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveSession(user.user_id, user.channel)}
                                  disabled={isSaving}
                                >
                                  {isSaving ? 'Guardando...' : 'Guardar Sesión'}
                                </Button>
                                <Button size="sm" variant="outline" onClick={handleCancelSession}>
                                  Cancelar
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditSession(user)}
                                disabled={!user.sessionStats}
                              >
                                Editar Sesión
                              </Button>
                            )}
                          </div>
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
