'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type IJump = {
  id: number;
  name: string;
  x: number;
  y: number;
};

const kJumps: IJump[] = [
  { id: 1, name: 'El Salto del Topo', x: 89.7, y: 75.8 },
  { id: 2, name: 'El Salto del Muro', x: 79.6, y: 84.7 },
  { id: 3, name: 'El Salto del Creeper', x: 89, y: 69.5 },
  { id: 4, name: 'El Salto del Laburo', x: 81, y: 74.7 },
  { id: 5, name: 'El Salto del Tejado', x: 86.7, y: 69.4 },
  { id: 6, name: 'El Salto de la Muerte', x: 2.3, y: 70.3 },
  { id: 7, name: 'El Salto de Aquaman', x: 45.8, y: 56 },
  { id: 8, name: 'El Salto del Papu!!!', x: 18.3, y: 73.7 },
  { id: 9, name: 'El Salto del Minipapu', x: 30, y: 62 },
  { id: 10, name: 'El Salto Mini del Minipapu', x: 21.7, y: 53 },
  { id: 11, name: 'El Salto de la Bresh', x: 6, y: 27.7 },
  { id: 12, name: 'El Salto de la Roca', x: 23, y: 27.3 },
  { id: 13, name: 'El Salto del Siglo', x: 23.5, y: 27.5 },
  { id: 14, name: 'El Salto del Pony', x: 43.4, y: 18 },
  { id: 15, name: 'El Salto del Vaquerito', x: 39.6, y: 7.6 },
  { id: 16, name: 'El Salto del Marcianito', x: 53.4, y: 19 },
  { id: 17, name: 'El Salto de la Mansion', x: 72.2, y: 62 },
  { id: 18, name: 'El Salto del Rapero', x: 50.6, y: 69 },
];

export default function GTAMap() {
  const [highlightedJump, setHighlightedJump] = useState<number | null>(null);
  const [movingJump, setMovingJump] = useState<IJump | null>(null);
  const [jumps, setJumps] = useState(kJumps);

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
