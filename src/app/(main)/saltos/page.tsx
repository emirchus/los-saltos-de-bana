import GTAMap from '@/components/gta-map';
import { SiteHeader } from '@/components/site-header';
import { IJump } from '@/interface/jumps';
import { createClient } from '@/lib/supabase/server';
import { cn } from '@/lib/utils';

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.from('locations').select('*');

  return (
    <>
      <SiteHeader title="Saltos de Bana" />
      <div className="flex flex-col items-center justify-center h-full w-full">
        <GTAMap jumps={data as IJump[]} />

        <div
          className={cn(
            'group fixed bottom-10 isolate inline-flex h-11 animate-rainbow items-center justify-center rounded-xl border-0 bg-size-[200%] px-8 py-2 font-medium text-primary-foreground transition-colors [background-clip:padding-box,border-box,border-box] bg-origin-border [border:calc(0.08*1rem)_solid_transparent] focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',

            // before styles
            'before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))] before:bg-size-[200%] before:filter-[blur(calc(0.8*1rem))]',

            // light mode colors
            'bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))]',

            // dark mode colors
            'dark:bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))]'
          )}
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-sm leading-6 text-accent">
              <strong className="font-extrabold text-green-600">5:19:07</strong>
              <svg viewBox="0 0 2 2" aria-hidden="true" className="mx-2 inline h-0.5 w-0.5 fill-current">
                <circle r={1} cx={1} cy={1} />
              </svg>
              ¡Nuevo Record! 30/09/2024
            </p>
            <a
              href="https://www.youtube.com/watch?v=F4--9Lnmt4U"
              className="flex-none rounded-md bg-background px-3.5 py-1 text-sm font-semibold text-foreground shadow-sm hover:bg-background/80 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
            >
              VER RECORD <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
