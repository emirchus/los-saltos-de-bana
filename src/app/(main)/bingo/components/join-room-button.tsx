'use client';

import { parseAsNumberLiteral, useQueryState } from 'nuqs';
import React from 'react';

import { TwoFactorCodeInput } from '@/components/twofactorinput';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { WobbleCard } from '@/components/ui/wobble-card';

export const JoinRoomButton = () => {
  const [open, setOpen] = useQueryState('o', parseAsNumberLiteral([0, 1]));

  return (
    <Dialog
      open={open === 1}
      onOpenChange={open => {
        setOpen(open ? 1 : null);
      }}
    >
      <DialogTrigger className="col-span-1 h-full min-h-[300px]">
        <WobbleCard containerClassName="h-full bg-green-800">
          <h2 className="max-w-80 text-balance text-left text-base font-semibold tracking-[-0.015em] text-white md:text-xl lg:text-3xl">
            Unirse a una sala
          </h2>
          <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
            Unite a una sala con el código que de sala!
          </p>
        </WobbleCard>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ingresar a una sala</DialogTitle>
          <DialogDescription>Ingresá a una sala con el código que te dieron</DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <Label>Código de la sala</Label>
            <TwoFactorCodeInput onChange={() => {}} className="w-full" />
          </div>
        </div>

        <DialogFooter>
          <Button>Unirse</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
