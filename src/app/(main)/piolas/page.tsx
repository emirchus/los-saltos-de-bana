import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { globalRankAction } from '@/app/(main)/piolas/actions/global-rank-action';
import { weekRankAction } from '@/app/(main)/piolas/actions/week-rank-action';
import { StarsView } from '@/app/(main)/piolas/components/stars-view';
import { VideoBackground } from '@/app/(main)/piolas/components/video-background';
import { PiolasPageClient } from '@/app/(main)/piolas/page.client';

interface Props {
  searchParams: Promise<{
    page: string;
    pageSize: string;
  }>;
}

const PAGE_SIZE = 100;
const DEFAULT_PAGE = 0;

export default async function PiolasPage({ searchParams }: Props) {
  const queryClient = new QueryClient();

  const { page, pageSize } = await searchParams;

  await queryClient.prefetchQuery({
    queryKey: ['week-rank', { page: Number(page) || DEFAULT_PAGE, pageSize: Number(pageSize) || PAGE_SIZE }],
    queryFn: () => weekRankAction({ page: Number(page) || DEFAULT_PAGE, pageSize: Number(pageSize) || PAGE_SIZE }),
  });

  await queryClient.prefetchQuery({
    queryKey: ['global-rank', { page: Number(page) || DEFAULT_PAGE, pageSize: Number(pageSize) || PAGE_SIZE }],
    queryFn: () => globalRankAction({ page: Number(page) || DEFAULT_PAGE, pageSize: Number(pageSize) || PAGE_SIZE }),
  });

  return (
    <div className="w-full h-full relative overflow-auto overflow-x-hidden">
      <VideoBackground />
      <StarsView />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PiolasPageClient />
      </HydrationBoundary>
    </div>
  );
}
