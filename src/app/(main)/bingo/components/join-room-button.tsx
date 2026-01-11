'use client';

import { useRouter } from 'next/navigation';
import { parseAsNumberLiteral, useQueryState } from 'nuqs';
import React, { useState } from 'react';

import { TwoFactorCodeInput } from '@/components/twofactorinput';
import { Alert } from '@/components/ui/alert';
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
import { supabase } from '@/lib/supabase/client';
import { useUser } from '@/provider/user-provider';

export const JoinRoomButton = () => {
  const [open, setOpen] = useQueryState('o', parseAsNumberLiteral([0, 1]));
  const [joinCode, setJoinCode] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const router = useRouter();
  const { setSignInAlertOpen, user } = useUser();

  const joinRoomByCode = async () => {
    if (!joinCode) {
      return;
    }

    const { data: room, error } = await supabase.from('bingo_rooms').select('*').eq('join_code', joinCode).single();

    if (error) {
      console.error('Error joining room:', error);
      setError('Código de sala inválido');

      setTimeout(() => {
        setError(undefined);
      }, 5000);
    } else {
      router.push(`/bingo/room/${room.id}`);
    }
  };

  return (
    <Dialog
      open={user !== null && open === 1}
      onOpenChange={open => {
        if (user === null) {
          setSignInAlertOpen(true);
        } else {
          setOpen(open ? 1 : null);
        }
        setError(undefined);
      }}
    >
      <DialogTrigger className="col-span-1 h-full min-h-[300px]">
        <WobbleCard containerClassName="h-full bg-green-800">
          <h2 className="max-w-80 text-balance text-left text-base font-semibold tracking-[-0.015em] text-white md:text-xl lg:text-3xl">
            Unirse a una sala
          </h2>
          <p className="mt-4 max-w-104 text-left text-base/6 text-neutral-200">
            Unite a una sala con el código que de sala!
          </p>
        </WobbleCard>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ingresar a una sala</DialogTitle>
          <DialogDescription>Ingresá a una sala con el código que te dieron</DialogDescription>
        </DialogHeader>
        {error && <Alert variant="destructive">{error}</Alert>}
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <Label>Código de la sala</Label>
            <TwoFactorCodeInput onChange={setJoinCode} className="w-full" />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={joinRoomByCode}>Unirse</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
