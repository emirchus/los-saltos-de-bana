import type { User } from '@supabase/supabase-js';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import type { Profile } from '@/interface/profile';
import { fetchUserInfo } from '@/lib/supabase/query';
import { createClient } from '@/lib/supabase/server';
import { ErrorProvider } from '@/provider/errors-provider';
import { UserProvider } from '@/provider/user-provider';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  let defaultUser: User | null = null;
  let defaultProfile: Profile | null = null;

  if (data.user) {
    defaultUser = data.user;
    const profile = await fetchUserInfo(supabase, data.user.id);
    defaultProfile = profile;
  }

  return (
    <ErrorProvider>
      <UserProvider defaultUser={defaultUser} defaultProfile={defaultProfile}>
        <SidebarProvider>
          <AppSidebar variant="inset" />
          <SidebarInset className="m-2 h-[calc(100vh-1rem)] rounded-md border-2 border-dashed p-0 flex flex-col w-screen overflow-hidden bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,var(--secondary),var(--background))]">
            {children}
          </SidebarInset>
        </SidebarProvider>
      </UserProvider>
    </ErrorProvider>
  );
}
