import { HowToPlay } from '@/components/how-to-play';
import SparklesText from '@/components/sparkle-title';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreateRoomButton } from './components/create-room-button';
import { ExploreRoomsButton } from './components/explore-rooms-button';
import { JoinRoomButton } from './components/join-room-button';

export const metadata = {
  title: 'Bingo',
  description: 'Bingo de Saltos de bananirou',
};

export default function BingoPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-start justify-items-center px-8">
      <Dialog>
        <DialogTrigger asChild>
          <button className="group relative inline-block cursor-pointer rounded-full bg-slate-800 p-px text-xs font-semibold leading-6 text-white no-underline shadow-2xl shadow-zinc-900">
            <span className="absolute inset-0 overflow-hidden rounded-full">
              <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </span>
            <div className="relative z-10 flex items-center space-x-2 rounded-full bg-zinc-950 px-4 py-0.5 ring-1 ring-white/10">
              <span>¿Como jugar?</span>
              <svg fill="none" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10.75 8.75L14.25 12L10.75 15.25"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Como jugar?</DialogTitle>
          </DialogHeader>
          <HowToPlay />
        </DialogContent>
      </Dialog>
      <SparklesText text="BINGO DE SALTOS" className="mt-4" />
      <div className="mx-auto my-auto grid w-full max-w-7xl grid-cols-1 gap-4 lg:grid-cols-3">
        <CreateRoomButton />
        <JoinRoomButton />
        <ExploreRoomsButton />
      </div>
    </div>
  );
}
