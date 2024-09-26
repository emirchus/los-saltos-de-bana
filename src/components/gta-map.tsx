'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { IJump } from '@/interface/jumps';

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

export default function GTAMap({ jumps: dbJumps }: { jumps: IJump[] }) {
  const [highlightedJump, setHighlightedJump] = useState<number | null>(null);
  const [movingJump, setMovingJump] = useState<IJump | null>(null);
  const [jumps, setJumps] = useState(dbJumps);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    console.log({ x, y });

    if (movingJump) {
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setJumps(jumps.map(jump => (jump.id === movingJump.id ? { ...jump, x, y } : jump)));
      setMovingJump(null);
    }
  };

  const handleMarkerClick = (e: React.MouseEvent<HTMLDivElement>, jump: IJump) => {
    e.stopPropagation();
    setMovingJump(jump);
  };
  return (
    <div className="container mx-auto p-4">
      <TooltipProvider>
        <TransformWrapper>
          <TransformComponent>
            <div className="relative" onClick={handleMapClick}>
              <Image
                src="/mapa.jpeg"
                width={4000}
                height={4000}
                alt="Mapa de GTA San Andreas"
                className="h-auto w-full"
                quality={100}
                priority
                placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
              />
              {jumps.map(jump => (
                <Tooltip key={jump.id}>
                  <TooltipTrigger asChild>
                    <div
                      className={`absolute flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#2c2416] bg-red-500 text-xs font-bold text-white transition-all duration-200 hover:scale-110 ${
                        highlightedJump === jump.id ? 'z-10 scale-150' : ''
                      }`}
                      style={{ left: `${jump.x}%`, top: `${jump.y}%`, transform: 'translate(-50%, -100%)' }}
                      onMouseEnter={() => setHighlightedJump(jump.id)}
                      onMouseLeave={() => setHighlightedJump(null)}
                      onClick={e => handleMarkerClick(e, jump)}
                    >
                      <span>{jump.id}</span>
                      <span className="sr-only">{jump.name}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{jump.name}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TransformComponent>
        </TransformWrapper>
      </TooltipProvider>
    </div>
  );
}
