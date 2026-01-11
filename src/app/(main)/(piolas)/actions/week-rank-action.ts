'use server';

import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { createPublicClient } from '@/lib/supabase/server';
import { getWeek } from '@/lib/utils';
import { Database } from '@/types_db';

interface Props {
  page: number;
  pageSize: number;
}

export const weekRankAction = async ({ page, pageSize }: Props): Promise<Database['public']['Tables']['user_stats_session']['Row'][]> => {
  'use cache';
  cacheTag('week-rank', `week-rank-page-${page}`);
  cacheLife('minutes'); // Cache por 1 minuto (configuración por defecto)

  const supabase = createPublicClient();
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
