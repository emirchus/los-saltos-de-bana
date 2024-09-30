import { PlaySquare } from 'lucide-react';

import SparklesText from '@/components/sparkle-title';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';

export const metadata = {
  title: 'Explorar salas',
  description: 'Explorar salas de bingo para jugar con amigos y más',
};

const Skeleton = () => (
  <div className="flex h-full min-h-[6rem] w-full flex-1 rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800"></div>
);
const items = [
  {
    title: 'La sala de Pepe',
    creador: 'Pepe',
    players: 8,
    header: <Skeleton />,
    icon: <PlaySquare className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: 'La sala del papu',
    creador: 'Pepe',
    players: 8,
    header: <Skeleton />,
    icon: <PlaySquare className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: 'NO ENTRAR',
    creador: 'Pepe',
    players: 8,
    header: <Skeleton />,
    icon: <PlaySquare className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: 'SALA SKIBIDI TOILET',
    creador: 'Pepe',
    players: 8,
    header: <Skeleton />,
    icon: <PlaySquare className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: 'SOLO BROCOLIS',
    creador: 'Pepe',
    players: 8,
    header: <Skeleton />,
    icon: <PlaySquare className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: 'CHADS Y SKIBIDIS MAMUS',
    creador: 'Pepe',
    players: 8,
    header: <Skeleton />,
    icon: <PlaySquare className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: 'eSPIRITUS',
    creador: 'Pepe',
    players: 8,
    header: <Skeleton />,
    icon: <PlaySquare className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: 'TOPARDOS',
    creador: 'Pepe',
    players: 8,
    header: <Skeleton />,
    icon: <PlaySquare className="h-4 w-4 text-neutral-500" />,
  },
];

export default function ExplorePage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-start justify-items-center py-8">
      <SparklesText text="SALAS CREADAS" className="mb-8" />

      <BentoGrid className="mx-auto w-full max-w-4xl">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            href={`/bingo/room/${item.title}`}
            title={item.title}
            creator={item.creador}
            players={item.players}
            header={item.header}
            icon={item.icon}
            className={i === 3 || i === 6 ? 'md:col-span-2' : ''}
          />
        ))}
      </BentoGrid>
    </div>
  );
}
