import { ViewTransition } from 'react';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden h-full">
      <ViewTransition name="page">{children}</ViewTransition>
    </div>
  );
}
