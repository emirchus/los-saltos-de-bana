import { ImageResponse } from 'next/og';

import { createClient } from '@/lib/supabase/server';

interface RoomPageProps {
  params: Promise<{
    id: string;
  }>;
}
export default async function Image({ params }: RoomPageProps) {
  const roomId = (await params).id;

  const supabase = await createClient();

  const [{ data: room }] = await Promise.all([
    supabase.from('bingo_rooms').select('*, created_by(*)').eq('id', roomId).single(),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          backgroundColor: 'white',
          backgroundImage:
            'radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)',
          backgroundSize: '100px 100px',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 40,
            fontStyle: 'normal',
            color: 'black',
            marginTop: 30,
            lineHeight: 1.8,
            whiteSpace: 'pre-wrap',
          }}
        >
          <b>{room?.name}</b>
        </div>
      </div>
    )
  );
}
