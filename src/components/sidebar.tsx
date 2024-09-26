'use client';

import { Label } from '@radix-ui/react-label';
import React from 'react';

import { IJump } from '@/interface/jumps';
import { useUIStore } from '@/stores/ui.store';
import { Switch } from './ui/switch';

interface SidebarProps {
  jumps: IJump[];
}

export const Sidebar = ({ jumps }: SidebarProps) => {
  const { jumpsChecked, toggleJumpChecked } = useUIStore();

  return (
    <div className="hidden w-[20vw] flex-col items-center gap-8 sm:items-start md:flex">
      <h3 className="text-2xl font-bold">Saltos</h3>
      <div className="flex flex-row gap-2">
        <Switch
          id="all"
          checked={jumpsChecked.length === jumps.length}
          onCheckedChange={() => {
            toggleJumpChecked(jumps.map(row => row.id));
          }}
        />
        <Label htmlFor="all" className="font-semibold">
          {jumpsChecked.length === jumps.length ? 'Mostrar' : 'Ocultar'} Todos
        </Label>
      </div>
      <ul className="flex flex-col gap-2">
        {jumps.map(row => (
          <li key={row.id.toString()} className="flex items-center gap-2">
            <Switch
              className="data-[state=checked]:bg-destructive"
              id={row.id.toString()}
              checked={jumpsChecked.includes(row.id)}
              onCheckedChange={() => toggleJumpChecked(row.id)}
            />
            <Label htmlFor={row.id.toString()} className="font-semibold">
              <code>{row.id}. </code> {row.name}
            </Label>
          </li>
        ))}
      </ul>
    </div>
  );
};
