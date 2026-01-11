'use client';

import Image from 'next/image';
import * as React from 'react';

export function Logo() {
  return (
    <div className="w-full rounded-md ring-ring focus-visible:outline-hidden focus-visible:ring-2 data-[state=open]:bg-accent">
      <div className="flex items-center gap-1.5 overflow-hidden px-2 py-1.5 text-left text-sm transition-all">
        <p className="line-clamp-1 flex-1 font-medium text-center font-pricedown-bl text-sidebar-accent-foreground text-2xl">
          Los Piola de Bana
        </p>
      </div>
    </div>
  );
}
