'use client';

import { useQuery } from '@tanstack/react-query';
import { weekRankAction } from '@/app/(main)/piolas/actions/week-rank-action';

export const useWeekRank = (page: number, pageSize: number) => {
  return useQuery({
    queryKey: ['week-rank', { page, pageSize }],
    queryFn: () => weekRankAction({ page, pageSize }),
    initialData: [],
  });
};
