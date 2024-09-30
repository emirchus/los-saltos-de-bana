import Link from 'next/link';

import { cn } from '@/lib/utils';

export const BentoGrid = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  return (
    <div className={cn('mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3', className)}>
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  creator,
  players,
  header,
  icon,
  href,
}: {
  className?: string;
  title?: string | React.ReactNode;
  creator: string | React.ReactNode;
  players: number | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  href: string;
}) => {
  return (
    <Link
      href={href}
      className={cn(
        'group/bento row-span-1 flex flex-col justify-between space-y-4 rounded-xl border border-border bg-card p-4 shadow-input transition duration-200 hover:shadow-xl',
        className
      )}
    >
      {header}
      <div className="transition duration-200 group-hover/bento:translate-x-2">
        {icon}
        <div className="mb-2 mt-2 font-sans font-semibold leading-none tracking-tight text-card-foreground">
          {title}
        </div>
        <div className="font-sans text-xs font-normal text-muted-foreground">Creado por: {creator}</div>
        <div className="font-sans text-xs font-normal text-muted-foreground">{players} jugadores</div>
      </div>
    </Link>
  );
};
