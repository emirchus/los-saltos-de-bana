import { Suspense } from 'react';
import { globalRankAction } from '@/app/(main)/(piolas)/actions/global-rank-action';
import { pointsRankAction, weekRankAction } from '@/app/(main)/(piolas)/actions/week-rank-action';
import { StarsView } from '@/app/(main)/(piolas)/components/stars-view';
import { VideoBackground } from '@/app/(main)/(piolas)/components/video-background';
import { PiolasPageClient } from '@/app/(main)/(piolas)/page.client';
import { SiteHeader } from '@/components/site-header';

interface Props {
  searchParams: Promise<{
    page: string;
    pageSize: string;
  }>;
}

const PAGE_SIZE = 100;
const DEFAULT_PAGE = 0;

export default async function PiolasPage({ searchParams }: Props) {
  const params = await searchParams;
  const pageNum = Number(params.page) || DEFAULT_PAGE;
  const pageSizeNum = Number(params.pageSize) || PAGE_SIZE;

  // Prefetch de datos usando cache (se incluyen en el static shell cuando es posible)
  // Cada combinación de page/pageSize tiene su propia entrada de cache
  const [pointsRankData, globalRankData] = await Promise.all([
    pointsRankAction({ page: pageNum, pageSize: pageSizeNum }),
    globalRankAction({ page: pageNum, pageSize: pageSizeNum }),
  ]);

  return (
    <div className="w-full h-full relative overflow-auto overflow-x-hidden">
      <VideoBackground videoUrl="https://kuynskxmgfjuveklharx.supabase.co/storage/v1/object/public/videos/Video%20Project.mp4" />
      <StarsView />
      <SiteHeader title="" />
      <Suspense fallback={<div className="container mx-auto px-4 py-12 max-w-6xl relative z-10">Cargando...</div>}>
        <PiolasPageClient initialPointsRank={pointsRankData} initialGlobalRank={globalRankData} />
      </Suspense>
    </div>
  );
}
