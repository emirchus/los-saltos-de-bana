'use client';
import { Flame, Heart, LayoutGrid, List, LucideIcon, ShoppingCart, SlidersHorizontal, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export type FilterType = 'all' | 'popular' | 'new' | 'favorites';

const filters: { id: FilterType; label: string; icon: LucideIcon }[] = [
  { id: 'all', label: 'Todos', icon: LayoutGrid },
  { id: 'new', label: 'Nuevos', icon: Sparkles },
  { id: 'popular', label: 'Populares', icon: Flame },
  { id: 'favorites', label: 'Favoritos', icon: Heart },
];

interface FilterButtonsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType | null) => void;
}

export function FilterButtons({ activeFilter, onFilterChange }: FilterButtonsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-wrap justify-center gap-3"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {filters.map((filter, index) => {
          const Icon = filter.icon;

          const isActive = activeFilter === filter.id;

          return (
            <motion.button
              key={filter.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onFilterChange(filter.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary/50 text-foreground border-border hover:border-primary/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{filter.label}</span>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
