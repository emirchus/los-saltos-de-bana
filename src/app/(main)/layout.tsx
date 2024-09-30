import { AppSidebar } from '@/components/app-sidebar';
import { SidebarLayout, SidebarTrigger } from '@/components/ui/sidebar';
import { fetchUserInfo } from '@/lib/supabase/query';
import { createClient } from '@/lib/supabase/server';
import { UserProvider } from '@/provider/user-provider';

import type { Profile } from '@/interface/profile';
import type { User } from '@supabase/supabase-js';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const { cookies } = await import('next/headers');

  const supabase = createClient();

  const { data } = await supabase.auth.getUser();

  let defaultUser: User | null = null;
  let defaultProfile: Profile | null = null;

  if (data.user) {
    defaultUser = data.user;
    const profile = await fetchUserInfo(supabase, data.user.id);
    defaultProfile = profile;
  }

  return (
    <UserProvider defaultUser={defaultUser} defaultProfile={defaultProfile}>
      <SidebarLayout defaultOpen={cookies().get('sidebar:state')?.value === 'true'}>
        <AppSidebar />
        <main className="flex flex-1 flex-col transition-all duration-300 ease-in-out">
          <div className="relative m-2 min-h-screen rounded-md border-2 border-dashed p-2 pl-8">
            <SidebarTrigger className="absolute left-0 top-0" />
            {children}
          </div>
        </main>
      </SidebarLayout>
    </UserProvider>
  );
}
