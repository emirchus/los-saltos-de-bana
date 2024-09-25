import GTAMap from '@/components/gta-map';
import SparklesText from '@/components/sparkle-title';

export default function Home() {
  return (
    <div className="min-h-screen items-center justify-items-center p-8 sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-8 sm:items-start">
        <SparklesText text="Mapa Oficial con Todos los Saltos del Bana" />
        <GTAMap />
      </main>
    </div>
  );
}
