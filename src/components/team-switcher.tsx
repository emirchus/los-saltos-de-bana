'use client';

import Image from 'next/image';
import * as React from 'react';

export function Logo() {
  return (
    <div className="w-full rounded-md ring-ring focus-visible:outline-none focus-visible:ring-2 data-[state=open]:bg-accent">
      <div className="flex items-center gap-1.5 overflow-hidden px-2 py-1.5 text-left text-sm transition-all">
        <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-primary text-primary-foreground">
          <Image src={'/LDB.png'} width={14} height={14} alt="logo" className="h-3.5 w-3.5 shrink-0" />
        </div>
        <div className="line-clamp-1 flex-1 pr-2 font-medium">Los Saltos de Bana</div>
      </div>
    </div>
  );
}
