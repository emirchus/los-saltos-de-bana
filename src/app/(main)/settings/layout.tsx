import { redirect, RedirectType } from 'next/navigation';

import { Separator } from '@/components/ui/separator';
import { createClient } from '@/lib/supabase/server';
import { SidebarNav } from './components/sidebar-nav';

const sidebarNavItems = [
  {
    title: 'Perfil',
    href: '/settings',
  },
  {
    title: 'Cuenta',
    href: '/settings/account',
  },
  {
    title: 'Apariencia',
    href: '/settings/appearance',
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default async function SettingsLayout({ children }: SettingsLayoutProps) {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect('/', RedirectType.push);

  return (
    <div className="space-y-6 p-10 pb-16 md:block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Configuración</h2>
        <p className="text-muted-foreground">Configura tu cuenta y preferencias de correo electrónico.</p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  );
}
