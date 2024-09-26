import { sql } from '@vercel/postgres';

import GTAMap from '@/components/gta-map';
import { Sidebar } from '@/components/sidebar';
import { IJump } from '@/interface/jumps';

interface Props {
  searchParams: {
    q?: string;
  };
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export default async function Home({}: Props) {
  const { rows } = await sql`SELECT * FROM locations`;

  return (
    <main className="flex flex-row items-center gap-8 sm:items-start">
      <Sidebar jumps={rows as IJump[]} />
      <GTAMap jumps={rows as IJump[]} />
    </main>
  );
}
