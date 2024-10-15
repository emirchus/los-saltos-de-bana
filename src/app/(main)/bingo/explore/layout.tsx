import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

import { createClient } from '@/lib/supabase/server';
import { RoomsProvider } from '@/provider/rooms-provider';

export const metadata = {
  title: 'Explorar salas',
  description: 'Explorar salas de bingo para jugar con amigos y más',
};

export default async function ExploreLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const [{ data }, { count }] = await Promise.all([
    supabase
      .from('bingo_rooms')
      .select('*, created_by(id, username)')
      .eq('status', 'active')
      .in('privacity', ['public', 'private'])
      .range(0, 9)
      .order('created_at', { ascending: false }),
    supabase.from('bingo_rooms').select('*', { count: 'exact', head: true }).in('privacity', ['public', 'private']),
  ]);

  return (
    <Suspense
      fallback={
        <div className="flex h-1/2 w-full items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      }
    >
      <RoomsProvider initialTotalRooms={count || 0} initialRooms={(data || []) as any}>
        {children}
      </RoomsProvider>
    </Suspense>
  );
}
