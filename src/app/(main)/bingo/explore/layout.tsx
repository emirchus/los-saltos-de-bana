import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import { RoomsProvider } from '@/provider/rooms-provider';
import { Database } from '@/types_db';

export const metadata = {
  title: 'Explorar salas',
  description: 'Explorar salas de bingo para jugar con amigos y más',
};

export default async function ExploreLayout({ children }: { children: React.ReactNode }) {
  const cookiesStore = cookies();
  const supabase = createServerComponentClient<Database>({ cookies: () => cookiesStore });

  const { data } = await supabase
    .from('bingo_rooms')
    .select('*, created_by(id, full_name)')
    .eq('status', 'active')
    .in('privacity', ['public', 'private'])
    .range(0, 9)
    .order('created_at', { ascending: false });
  console.log(data);

  // Count of rooms
  const { count } = await supabase
    .from('bingo_rooms')
    .select('*', { count: 'exact', head: true })
    .in('privacity', ['public', 'private']);

  return (
    <RoomsProvider initialTotalRooms={count || 0} initialRooms={(data || []) as any}>
      {children}
    </RoomsProvider>
  );
}
