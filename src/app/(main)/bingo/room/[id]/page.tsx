import { Metadata } from 'next';
import { notFound, redirect, RedirectType } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IJump } from '@/interface/jumps';
import { siteConfig } from '@/lib/config';
import { createClient } from '@/lib/supabase/server';
import { cn } from '@/lib/utils';
import { ClipboardButton } from './clipboard-button';

interface RoomPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata(props: RoomPageProps): Promise<Metadata> {
  const params = await props.params;

  if (isNaN(Number(params.id))) {
    notFound();
  }

  const supabase = await createClient();

  const [{ data: room }] = await Promise.all([
    supabase.from('bingo_rooms').select('*, created_by(*)').eq('id', params.id).single(),
  ]);

  return {
    title: room?.name,
    description: 'Juega bingo con tus amigos.',
    twitter: {
      title: room?.name,
      description: 'Juega bingo con tus amigos.',
      card: 'summary_large_image',
      site: siteConfig.links.twitter,
      images: [{ url: siteConfig.ogImage, alt: siteConfig.name }],
    },
  };
}

export default async function RoomPage(props: RoomPageProps) {
  const params = await props.params;
  const supabase = await createClient();

  if (isNaN(Number(params.id))) {
    notFound();
  }

  const [user, { data: room }, { data: jumps }] = await Promise.all([
    await supabase.auth.getUser(),
    supabase.from('bingo_rooms').select('*, created_by(*)').eq('id', params.id).single(),
    supabase.from('locations').select('*'),
  ]);

  if (!user.data || user.error) {
    redirect('/?error=No se ha iniciado sesión', RedirectType.replace);
  }

  if (!room) {
    redirect('/?error=No se encontró la sala', RedirectType.replace);
  }

  const generateBingoCard = () => {
    const newCard = [];
    for (let i = 0; i < 5; i++) {
      const row = [];
      for (let j = 0; j < 5; j++) {
        const min = 1;
        const max = jumps!.length;
        const number = Math.floor(Math.random() * (max - min + 1)) + min;
        row.push({ number, marked: false });
      }
      newCard.push(row);
    }
    return newCard;
  };

  const getOrCreateBingoCard = async () => {
    const { data, error } = await supabase.rpc('get_or_create_player_board', {
      p_user_id: user.data.user!.id,
      p_room_id: Number(params.id),
      p_board: generateBingoCard(),
    });

    if (error) {
      console.error('Error getting or creating bingo card:', error);
      redirect('/?error=No se pudo crear el bingo card', RedirectType.replace);
    }
    return data as {
      number: number;
      marked: boolean;
    }[][];
  };

  const bingoCard = await getOrCreateBingoCard();

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-3xl">
        Bingo - Sala: <span className="font-bold">{room.name}</span>
      </h1>
      {(room.created_by as any).id === user.data.user!.id && (
        <div className="relative mb-4 flex max-w-md flex-col items-start justify-start gap-2">
          <Label htmlFor="creator-name">Creador</Label>
          <Input id="creator-name" value={(room.created_by as any).username} readOnly className="h-10" />
        </div>
      )}
      {(room.created_by as any).id === user.data.user!.id && (
        <div className="relative flex max-w-md flex-col items-start justify-start gap-2">
          <Label htmlFor="room-code">Código de la sala</Label>
          <Input id="room-code" value={room.join_code ?? ''} readOnly className="h-10" />
          <ClipboardButton code={room.join_code ?? ''} />
        </div>
      )}

      <div className="my-4 grid grid-cols-5 gap-2">
        {bingoCard!.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <JumpCard jump={jumps!.find(jump => jump.id === cell.number) as IJump} key={`${rowIndex}-${colIndex}`} />
          ))
        )}
      </div>
    </div>
  );
}

function JumpCard({ jump }: { jump: IJump }) {
  return (
    <div className="w-full max-w-xs">
      <div
        className={cn(
          'card group relative mx-auto flex h-[150px] w-full cursor-pointer flex-col justify-end overflow-hidden rounded-md border border-transparent p-4 shadow-xl dark:border-neutral-800',
          'bg-[url(https://pbs.twimg.com/media/GY2NYgfWUAAEFIf?format=jpg&name=medium)] bg-cover',
          // Preload hover image by setting it in a pseudo-element
          'before:fixed before:inset-0 before:z-[-1] before:bg-[url(https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWlodTF3MjJ3NnJiY3Rlc2J0ZmE0c28yeWoxc3gxY2VtZzA5ejF1NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/syEfLvksYQnmM/giphy.gif)] before:opacity-0',
          'hover:bg-[url(https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWlodTF3MjJ3NnJiY3Rlc2J0ZmE0c28yeWoxc3gxY2VtZzA5ejF1NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/syEfLvksYQnmM/giphy.gif)]',
          "hover:after:absolute hover:after:inset-0 hover:after:bg-black hover:after:opacity-50 hover:after:content-['']",
          'transition-all duration-500'
        )}
      >
        <div className="relative z-50 flex h-full flex-col items-center justify-center">
          <h3 className="text-center text-xl font-bold text-gray-50 md:text-xl">{jump.name}</h3>
        </div>
      </div>
    </div>
  );
}
