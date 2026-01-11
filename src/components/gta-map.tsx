'use client';

import { YouTubeEmbed } from '@next/third-parties/google';
import { HoverCardPortal } from '@radix-ui/react-hover-card';
import { TooltipPortal } from '@radix-ui/react-tooltip';
import confetti from 'canvas-confetti';
import Image from 'next/image';
import React from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { IJump } from '@/interface/jumps';
import { Button } from './ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';

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
  // const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
  //   const rect = imgRef.current?.getBoundingClientRect();

  //   if (!rect) return;

  //   const x = ((e.clientX - rect.left) / rect.width) * 100;
  //   const y = ((e.clientY - rect.top) / rect.height) * 100;
  //   console.log({ x, y });
  // };

  return (
    <div className="aspect-square flex items-center justify-center" style={{
      "--map-size": "70rem",
    } as React.CSSProperties}>
      <TooltipProvider>
        <TransformWrapper zoomAnimation={{ disabled: true }}>
          <TransformComponent
            wrapperClass={`w-[60vw]! h-[60vw]! xl:h-(--map-size)! xl:w-(--map-size)! overflow-hidden! rounded-xl border-2 border-dashed shadow-md`}
            contentClass={`w-[60vw]! h-[60vw]! xl:h-(--map-size)! xl:w-(--map-size)!`}
          >
            <div className="relative z-0 h-full w-full bg-red-100">
              <Image
                src="/mapa (1).webp"
                alt="Mapa de GTA San Andreas"
                className="aspect-square h-full w-full"
                quality={86}
                fill
                style={{ objectFit: 'contain' }}
                loading="eager"
                priority
                placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(1000, 1000))}`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
              />
              {jumps.map(jump => (
                <MapMarker key={jump.id} jump={jump} />
              ))}
            </div>
          </TransformComponent>
        </TransformWrapper>
      </TooltipProvider>
    </div>
  );
}

export function MapMarker({ jump }: { jump: IJump }) {
  if (jump.video) {
    return (
      <HoverCard openDelay={0} closeDelay={1000}>
        <HoverCardTrigger asChild>
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
        </HoverCardTrigger>
        <HoverCardPortal>
          <HoverCardContent className="flex h-fit w-[400px] flex-col items-start justify-start">
            <p className="text-lg font-bold">{jump.name}</p>
            <div className="my-4 h-[200px] w-full">
              <YouTubeEmbed videoid={jump.video!} />
            </div>

            <Button variant={'link'} asChild>
              <a href={`https://www.youtube.com/watch?v=${jump.video}`} target="_blank">
                Ver en YouTube
              </a>
            </Button>
          </HoverCardContent>
        </HoverCardPortal>
      </HoverCard>
    );
  }
  return (
    <Tooltip delayDuration={0}>
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
      <TooltipPortal>
        <TooltipContent>{jump.name}</TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}
