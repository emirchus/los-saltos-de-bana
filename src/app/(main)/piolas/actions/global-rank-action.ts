'use server';

import 'server-only';

import { createClient } from '@/lib/supabase/server';
import { getWeek } from '@/lib/utils';
import { Database } from '@/types_db';

interface Props {
  page: number;
  pageSize: number;
}

export const globalRankAction = async ({ page, pageSize }: Props): Promise<Database['public']['Tables']['user_stats']['Row'][]> => {
  const supabase = await createClient();

  const { data, error } = await supabase.from('user_stats').select('*')
    .order('stars', { ascending: false })
    .range(page * pageSize, (page + 1) * pageSize);

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  console.log(data);

  return data;
};
