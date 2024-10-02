'use client';

import { Loader2, PlaySquare } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import SparklesText from '@/components/sparkle-title';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { useRooms } from '@/provider/rooms-provider';

export default function ExplorePage() {
  const { rooms, refreshRooms, hasMore, loading } = useRooms();

  const { inView, ref } = useInView();

  useEffect(() => {
    if (inView && hasMore) {
      refreshRooms();
    }
  }, [inView, refreshRooms, hasMore]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-start justify-items-center py-8">
      <SparklesText text="SALAS CREADAS" className="mb-8" />

      <BentoGrid className="mx-auto w-full max-w-4xl">
        {(rooms || []).map((item, i) => (
          <BentoGridItem
            key={i}
            href={`/bingo/room/${item.id}`}
            header={
              <div className="flex h-full min-h-[6rem] w-full flex-1 rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
                <Image
                  src={'/Los_Saltos_de_Bana_no_background.png'}
                  className="h-auto min-h-[6rem] w-full flex-1 rounded-xl object-cover"
                  alt="Los Saltos de Bana"
                  width={1000}
                  height={1000}
                  quality={86}
                />
              </div>
            }
            icon={<PlaySquare className="h-4 w-4 text-neutral-500" />}
            className={i === 3 || i === 6 ? 'md:col-span-2' : ''}
            room={item}
          />
        ))}
      </BentoGrid>
      {loading ? (
        <div className="flex h-full w-full items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      ) : (
        <div ref={ref} className="h-4 w-full bg-transparent"></div>
      )}
    </div>
  );
}
