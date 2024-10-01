import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { BingoRoom } from '@/interface/bingo';
import { cn } from '@/lib/utils';
import { TwoFactorCodeInput } from '../twofactorinput';
import { Alert } from './alert';
import { Button } from './button';
import { Label } from './label';

export const BentoGrid = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  return (
    <div className={cn('mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3', className)}>
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  header,
  icon,
  room,
  href,
}: {
  className?: string;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  href: string;
  room: BingoRoom;
}) => {
  const [open, setOpen] = useState(false);
  const [joinCode, setJoinCode] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const router = useRouter();

  const players = room.players ?? 0;

  const joinRoomByCode = async () => {
    if (!joinCode) {
      return;
    }

    const isCodeValid = room.join_code === joinCode;

    if (!isCodeValid) {
      console.error('Error joining room:', error);
      setError('Código de sala inválido');

      setTimeout(() => {
        setError(undefined);
      }, 5000);
    } else {
      router.push(`/bingo/room/${room.id}`);
    }
  };
  const Parent = room.privacity === 'public' ? Link : 'div';

  const Element = (
    <Parent
      href={href}
      {...(room.privacity === 'private'
        ? {
            onClick: () => setOpen(true),
          }
        : {})}
      className={cn(
        'group/bento row-span-1 flex flex-col justify-between space-y-4 rounded-xl border border-border bg-card p-4 shadow-input transition duration-200 hover:cursor-pointer hover:shadow-xl',
        className
      )}
    >
      {header}
      <div className="transition duration-200 group-hover/bento:translate-x-2">
        {icon}
        <div className="mb-2 mt-2 font-sans font-semibold leading-none tracking-tight text-card-foreground">
          {room.name}
        </div>
        <div className="font-sans text-xs font-normal text-muted-foreground">
          Creado por: {room.created_by.full_name}
        </div>
        <div className="font-sans text-xs font-normal text-muted-foreground">{players} jugadores</div>
      </div>
    </Parent>
  );

  if (room.privacity === 'private') {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{Element}</DialogTrigger>
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
  }

  return Element;
};
