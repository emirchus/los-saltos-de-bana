'use client';

import Image from 'next/image';
import * as React from 'react';

export function Logo() {
  return (
    <div className="w-full rounded-md ring-ring focus-visible:outline-none focus-visible:ring-2 data-[state=open]:bg-accent">
      <div className="flex items-center gap-1.5 overflow-hidden px-2 py-1.5 text-left text-sm transition-all">
        <Image src={'/LSB.png'} width={848} height={605} alt="logo" className="h-auto w-10 shrink-0" />

        <div className="line-clamp-1 flex-1 pr-2 font-medium">Los Saltos de Bana</div>
      </div>
    </div>
  );
}
