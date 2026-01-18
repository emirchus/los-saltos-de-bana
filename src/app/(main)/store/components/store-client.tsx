'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { getProducts, searchProducts } from '../actions/products-action';
import { FilterButtons, type FilterType } from './filter-buttons';
import { ProductGrid } from './product-grid';
import { SearchBar } from './search-bar';

export function StoreClient() {
  // Usar nuqs para manejar los searchParams
  const [searchQuery, setSearchQuery] = useQueryState(
    'search',
    parseAsString.withDefault('').withOptions({
      shallow: true,
    })
  );
  const [activeFilter, setActiveFilter] = useQueryState(
    'filter',
    parseAsString.withDefault('all').withOptions({
      shallow: true,
    })
  );

  // Normalizar el filtro a FilterType
  const normalizedFilter: FilterType = (
    activeFilter === 'newest' || activeFilter === 'popular' || activeFilter === 'new' || activeFilter === 'favorites'
      ? activeFilter
      : 'all'
  ) as FilterType;

  // Wrapper para setActiveFilter que acepta FilterType | null
  const handleFilterChange = async (filter: FilterType | null) => {
    await setActiveFilter(filter === 'all' ? null : filter);
  };

  // Obtener productos según búsqueda
  const { data: searchedProducts, isLoading: isSearching } = useQuery({
    queryKey: ['products', 'search', searchQuery],
    queryFn: () => (searchQuery ? searchProducts(searchQuery) : getProducts()),
    enabled: true,
  });

  // Obtener productos según filtro (si no hay búsqueda)
  const { data: filteredProducts, isLoading: isFiltering } = useQuery({
    queryKey: ['products', 'filter', normalizedFilter],
    queryFn: () => {
      const sortBy = normalizedFilter === 'new' ? 'newest' : normalizedFilter === 'popular' ? 'popular' : undefined;
      return getProducts({ sortBy });
    },
    enabled: !searchQuery,
  });

  // Determinar qué productos mostrar
  const products = useMemo(() => {
    if (searchQuery) {
      return searchedProducts || [];
    }
    return filteredProducts || [];
  }, [searchQuery, searchedProducts, filteredProducts]);

  // Aplicar filtro adicional a los productos buscados
  const filteredProductsList = useMemo(() => {
    if (searchQuery) {
      // Si hay búsqueda, aplicar filtro sobre los resultados
      const sorted = [...products];
      switch (normalizedFilter) {
        case 'new':
          sorted.sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return dateB - dateA;
          });
          break;
        case 'popular':
          sorted.sort((a, b) => b.id - a.id);
          break;
        default:
          break;
      }
      return sorted;
    }
    return products;
  }, [products, normalizedFilter, searchQuery]);

  const isLoading = isSearching || isFiltering;

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      {/* Header con búsqueda, filtros y carrito */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="space-y-8"
      >
        <SearchBar onSearch={setSearchQuery} initialValue={searchQuery} />

        <FilterButtons activeFilter={normalizedFilter} onFilterChange={handleFilterChange} />
      </motion.div>

      {/* Grid de productos */}
      <div className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-muted-foreground">Cargando productos...</p>
          </div>
        ) : (
          <ProductGrid products={filteredProductsList} />
        )}
      </div>
    </div>
  );
}
