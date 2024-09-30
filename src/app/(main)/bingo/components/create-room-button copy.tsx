'use client';

import { PlusSquareIcon } from 'lucide-react';
import { parseAsNumberLiteral, useQueryState } from 'nuqs';
import React from 'react';

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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WobbleCard } from '@/components/ui/wobble-card';

export const CreateRoomButton = () => {
  const [open, setOpen] = useQueryState('o', parseAsNumberLiteral([0, 1]));

  return (
    <Dialog
      open={open === 0}
      onOpenChange={open => {
        setOpen(open ? 0 : null);
      }}
    >
      <DialogTrigger className="col-span-1 h-full min-h-[500px] lg:col-span-2 lg:min-h-[300px]">
        <WobbleCard containerClassName="h-full bg-pink-800" className="">
          <div className="max-w-xs">
            <h2 className="text-balance text-left text-base font-semibold tracking-[-0.015em] text-white md:text-xl lg:text-3xl">
              Crear sala
            </h2>
            <p className="mt-4 text-left text-base/6 text-neutral-200">
              Creá una sala para jugar con tus amigos al bingo
            </p>
          </div>
          <PlusSquareIcon className="absolute -bottom-20 -right-20 h-[400px] w-[400px] text-white" />
        </WobbleCard>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear sala</DialogTitle>
          <DialogDescription>Creá una sala para jugar con tus amigos al bingo</DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <Label>Nombre de la sala</Label>
            <Input placeholder="La sala del papu" />
          </div>
          <div className="flex flex-col gap-4">
            <Label>Estado de la sala</Label>
            <Select defaultValue="public">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Estado de la sala" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Privada</SelectItem>
                <SelectItem value="public">Publica</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button>Crear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
