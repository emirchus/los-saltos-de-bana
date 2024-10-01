import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { notFound, redirect, RedirectType } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from '@/types_db';

interface RoomPageProps {
  params: {
    id: string;
  };
}

export default async function RoomPage({ params }: RoomPageProps) {
  const cookiesStore = cookies();

  const supabase = createServerComponentClient<Database>({ cookies: () => cookiesStore });
  const user = await supabase.auth.getUser();

  if (isNaN(Number(params.id))) {
    notFound();
  }

  const { data: room } = await supabase.from('bingo_rooms').select('*, created_by(*)').eq('id', params.id).single();

  if (!user.data || user.error) {
    revalidatePath('/', 'page');
    redirect('/', RedirectType.replace);
  }

  if (!room) {
    notFound();
  }

  const { data: jumps } = await supabase.from('locations').select('*');

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

      //TODO: Handle error
    }
    return data as {
      number: number;
      marked: boolean;
    }[][];
  };

  const bingoCard = await getOrCreateBingoCard();

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-row items-center justify-start">
        <h1 className="mb-4 text-3xl font-bold">Bingo - Sala: {room.name}</h1>
      </div>
      <p className="mb-2">Creador: {(room.created_by as any).full_name}</p>
      <div className="mb-4 grid grid-cols-5 gap-2">
        {bingoCard!.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Card key={`${rowIndex}-${colIndex}`}>
              <CardHeader>
                <CardTitle>{jumps!.find(jump => jump.id === cell.number)?.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-xl font-bold text-card-foreground">{cell.number}</span>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      {/* <div className="mb-4">
        <h2 className="mb-2 text-xl font-bold">Números llamados</h2>
        <div className="flex flex-wrap gap-2">
          {calledNumbers.map(number => (
            <span key={number} className="rounded bg-blue-500 px-2 py-1 text-white">
              {number}
            </span>
          ))}
        </div>
      </div> */}
      {/* <Button onClick={callNumber} className="bg-red-500 text-white">
        Llamar número
      </Button>
      <Button onClick={() => setCurrentRoom(null)} className="ml-2">
        Salir de la sala
      </Button> */}
    </div>
  );
}
