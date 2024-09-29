import GTAMap from '@/components/gta-map';
import { IJump } from '@/interface/jumps';
import { createClient } from '@/lib/supabase/server';

interface Props {
  searchParams: {
    q?: string;
  };
}

export default async function Home({}: Props) {
  const supabase = createClient();
  const { data } = await supabase.from('locations').select('*');

  return (
    <div className="flex h-full w-full flex-col items-center justify-start justify-items-center p-8">
      {/* <SparklesText text="Mapa con todos los saltos de Bana" /> */}

      <GTAMap jumps={data as IJump[]} />
    </div>
  );
}
