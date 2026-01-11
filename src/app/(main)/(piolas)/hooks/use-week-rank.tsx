'use client';

import { useQuery } from '@tanstack/react-query';
import { pointsRankAction, weekRankAction } from '@/app/(main)/(piolas)/actions/week-rank-action';
import { Database } from '@/types_db';

export const useWeekRank = (page: number, pageSize: number) => {
  return useQuery({
    queryKey: ['week-rank', { page, pageSize }],
    queryFn: () => weekRankAction({ page, pageSize }),
    initialData: [],
  });
};
export const usePointsRank = (
  page: number,
  pageSize: number,
  {
    initialData,
  }: {
    initialData?: Database['public']['Tables']['user_stats']['Row'][];
  }
) => {
  return useQuery({
    queryKey: ['points-rank', { page, pageSize }],
    queryFn: () => pointsRankAction({ page, pageSize }),
    initialData: initialData || [],
  });
};
