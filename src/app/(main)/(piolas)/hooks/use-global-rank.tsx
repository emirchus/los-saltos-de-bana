'use client';

import { useQuery } from '@tanstack/react-query';
import { globalRankAction } from '@/app/(main)/(piolas)/actions/global-rank-action';

export const useGlobalRank = (page: number, pageSize: number) => {
  return useQuery({
    queryKey: ['global-rank', { page, pageSize }],
    queryFn: () => globalRankAction({ page, pageSize }),
    initialData: [],
  });
};
