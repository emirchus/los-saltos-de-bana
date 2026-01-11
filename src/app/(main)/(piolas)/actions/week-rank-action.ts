'use server';

import 'server-only';

import { createClient } from '@/lib/supabase/server';
import { getWeek } from '@/lib/utils';
import { Database } from '@/types_db';

interface Props {
  page: number;
  pageSize: number;
}

export const weekRankAction = async ({ page, pageSize }: Props): Promise<Database['public']['Tables']['user_stats_session']['Row'][]> => {
  const supabase = await createClient();
  const { start, end } = getWeek();


  const { data, error } = await supabase.from('user_stats_session').select('*, stream_sessions(*)')
    .lte('stream_sessions.started_at', end.toISOString())
    .gte('stream_sessions.started_at', start.toISOString())
    .gte('stream_sessions.ended_at', start.toISOString())
    .order('points', { ascending: false })
    .range(page * pageSize, (page + 1) * pageSize);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
