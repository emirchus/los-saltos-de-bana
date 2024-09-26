'use client';

import confetti from 'canvas-confetti';
import Image from 'next/image';
import React from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { IJump } from '@/interface/jumps';
import { useUIStore } from '@/stores/ui.store';

const toBase64 = (str: string) =>
  typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str);
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

export default function GTAMap({ jumps }: { jumps: IJump[] }) {
  const { jumpsChecked } = useUIStore();
  // const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
  //   const rect = e.currentTarget.getBoundingClientRect();
  //   const x = ((e.clientX - rect.left) / rect.width) * 100;
  //   const y = ((e.clientY - rect.top) / rect.height) * 100;
  //   console.log({ x, y });
  // };

  return (
    <div className="container mx-auto overflow-hidden p-4">
      <TooltipProvider>
        <TransformWrapper>
          <TransformComponent wrapperClass="rounded-md overflow-hidden">
            <div className="relative">
              <Image
                src="/mapa.webp"
                width={4000}
                height={4000}
                alt="Mapa de GTA San Andreas"
                className="h-auto w-full"
                quality={86}
                loading="eager"
                priority
                placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
              />
              {jumps
                .filter(jump => !jumpsChecked.includes(jump.id))
                .map(jump => (
                  <Tooltip key={jump.id}>
                    <TooltipTrigger asChild>
                      <div
                        className={`absolute flex h-[2vh] w-[2vh] items-center justify-center rounded-full border-2 border-[#2c2416] bg-red-500 text-xs font-bold text-white transition-all duration-200 hover:scale-110`}
                        style={{ left: `${jump.x}%`, top: `${jump.y}%`, transform: 'translate(-50%, -100%)' }}
                        onMouseEnter={e => {
                          if (jump.id == 8)
                            confetti({
                              particleCount: 100,
                              spread: 180,
                              origin: {
                                x: e.clientX / window.innerWidth,
                                y: e.clientY / window.innerHeight,
                              },
                              shapes: ['star'],
                              colors: ['#ffff54'],
                            });
                        }}
                      >
                        <span>{jump.id}</span>
                        <span className="sr-only">{jump.name}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>{jump.name}</TooltipContent>
                  </Tooltip>
                ))}
            </div>
          </TransformComponent>
        </TransformWrapper>
      </TooltipProvider>
    </div>
  );
}
