'use client';

import { useQuery } from '@tanstack/react-query';
import { globalRankAction } from '@/app/(main)/(piolas)/actions/global-rank-action';
import { Database } from '@/types_db';

export const useGlobalRank = (
  page: number,
  pageSize: number,
  {
    initialData,
  }: {
    initialData?: Database['public']['Tables']['user_stats']['Row'][];
  }
) => {
  return useQuery({
    queryKey: ['global-rank', { page, pageSize }],
    queryFn: () => globalRankAction({ page, pageSize }),
    initialData: initialData || [],
  });
};
