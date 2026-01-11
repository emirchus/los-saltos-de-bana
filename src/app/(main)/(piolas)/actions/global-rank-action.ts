'use server';

import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { createPublicClient } from '@/lib/supabase/server';
import { Database } from '@/types_db';

interface Props {
  page: number;
  pageSize: number;
}

export const globalRankAction = async ({ page, pageSize }: Props): Promise<Database['public']['Tables']['user_stats']['Row'][]> => {
  'use cache';
  cacheTag('global-rank', `global-rank-page-${page}`);
  cacheLife('minutes'); // Cache por 1 minuto (configuración por defecto)

  const supabase = createPublicClient();

  const { data, error } = await supabase.from('user_stats').select('*')
    .order('stars', { ascending: false })
    .range(page * pageSize, (page + 1) * pageSize);

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
};
