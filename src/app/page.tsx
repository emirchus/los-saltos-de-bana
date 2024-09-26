import { sql } from '@vercel/postgres';

import GTAMap from '@/components/gta-map';
import { Sidebar } from '@/components/sidebar';
import SparklesText from '@/components/sparkle-title';
import { IJump } from '@/interface/jumps';

interface Props {
  searchParams: {
    q?: string;
  };
}

export default async function Home({}: Props) {
  const { rows } = await sql`SELECT * FROM locations`;

  return (
    <div className="flex min-h-screen flex-col items-center justify-start justify-items-center p-8">
      <header className="container my-8 flex flex-col items-center justify-center">
        <SparklesText text="Mapa con todos los saltos de Bana" />
      </header>
      <main className="flex flex-row items-center gap-8 sm:items-start">
        <Sidebar jumps={rows as IJump[]} />
        <GTAMap jumps={rows as IJump[]} />
      </main>
      <footer className="flex w-full flex-col items-center justify-center">
        <p className="text-sm text-gray-500">Este es un mapa de GTA San Andreas con todos los saltos del juego.</p>
        <div className="flex flex-row gap-2">
          <a href="https://github.com/SampProject-game/SVGMap-GTA-San-Andreas">Mapa Original</a>
          <a href="https://github.com/emirchus/los-saltos-de-bana">GitHub</a>
          <a href="https://x.com/pp0ke_/status/1838318507647201380/">Idea original</a>
        </div>
      </footer>
    </div>
  );
}
