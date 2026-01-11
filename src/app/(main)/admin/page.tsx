import { getChannelsSettings } from './actions/channels-settings-action';
import { getUsers } from './actions/users-action';
import { ChannelsSettingsForm } from './components/channels-settings-form';
import { UsersTable } from './components/users-table';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Verificar que el usuario esté autenticado
  if (!user) {
    redirect('/');
  }

  // Obtener datos
  const [channelsSettings, users] = await Promise.all([
    getChannelsSettings(),
    getUsers({ page: 0, pageSize: 20 }),
  ]);

  return (
    <div className="container mx-auto p-6 space-y-6 overflow-y-auto h-full">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <p className="text-muted-foreground">
          Gestiona la configuración de canales y los puntos/estrellas de los usuarios
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Configuración de Canales</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {channelsSettings.map(settings => (
              <ChannelsSettingsForm key={settings.channel} settings={settings} />
            ))}
            {channelsSettings.length === 0 && (
              <div className="text-muted-foreground">No hay configuraciones de canales</div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Usuarios</h2>
          <UsersTable initialUsers={users} />
        </div>
      </div>
    </div>
  );
}
