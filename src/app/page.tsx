import { sql } from '@vercel/postgres';

import GTAMap from '@/components/gta-map';
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
    <div className="min-h-screen items-center justify-items-center p-8 sm:p-20">
      <header className="flex flex-col items-center justify-center">
        <SparklesText text="Mapa Oficial con Todos los Saltos del Bana" />
      </header>
      <main className="row-start-2 flex flex-col items-center gap-8 sm:items-start">
        <GTAMap jumps={rows as IJump[]} />
      </main>
      <footer className="flex flex-col items-center justify-center">
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
