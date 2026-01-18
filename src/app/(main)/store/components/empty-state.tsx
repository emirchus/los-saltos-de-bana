'use client';

import { PackageSearch } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <PackageSearch className="mb-4 h-16 w-16 text-muted-foreground" />
      <h3 className="mb-2 text-lg font-semibold">No se encontraron productos</h3>
      <p className="text-sm text-muted-foreground">Intenta ajustar tus filtros de búsqueda</p>
    </div>
  );
}
