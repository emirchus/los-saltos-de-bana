import { CompassIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { WobbleCard } from '@/components/ui/wobble-card';

export const ExploreRoomsButton = () => {
  return (
    <Link href="/bingo/explore" className="col-span-1 min-h-[500px] lg:col-span-3 lg:min-h-[600px] xl:min-h-[300px]">
      <WobbleCard containerClassName="bg-blue-900 h-full">
        <div className="max-w-sm">
          <h2 className="max-w-sm text-balance text-left text-base font-semibold tracking-[-0.015em] text-white md:max-w-lg md:text-xl lg:text-3xl">
            Explorar salas
          </h2>
          <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
            Explora salas públicas y jugá con desconocidos
          </p>
        </div>
        <CompassIcon className="absolute -bottom-20 -right-20 h-[500px] w-[500px] text-white" />
      </WobbleCard>
    </Link>
  );
};
