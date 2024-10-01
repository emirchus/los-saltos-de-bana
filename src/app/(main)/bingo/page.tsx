import SparklesText from '@/components/sparkle-title';
import { CreateRoomButton } from './components/create-room-button';
import { ExploreRoomsButton } from './components/explore-rooms-button';
import { JoinRoomButton } from './components/join-room-button';

export const metadata = {
  title: 'Bingo',
  description: 'Bingo de Saltos de bananirou',
};

export default function BingoPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-start justify-items-center p-8">
      <SparklesText text="BINGO DE SALTOS" />

      <div className="mx-auto my-auto grid w-full max-w-7xl grid-cols-1 gap-4 lg:grid-cols-3">
        <CreateRoomButton />
        <JoinRoomButton />
        <ExploreRoomsButton />
      </div>
    </div>
  );
}
