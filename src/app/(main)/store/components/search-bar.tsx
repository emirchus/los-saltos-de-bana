'use client';

import { Search } from 'lucide-react';
import { motion } from 'motion/react';
import { useDebounceCallback } from '@/hooks/use-debounce';

interface SearchBarProps {
  onSearch: (query: string | null) => Promise<URLSearchParams>;
  placeholder?: string;
  initialValue?: string;
}

export function SearchBar({ onSearch, placeholder = 'Buscar productos...', initialValue = '' }: SearchBarProps) {
  const handleDebouceChange = useDebounceCallback<string>((value: string) => {
    if (value != null && value.trim().length > 0) {
      onSearch(value);
    } else {
      onSearch(null);
    }
  }, 300);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative max-w-2xl mx-auto"
    >
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar Productos..."
          defaultValue={initialValue}
          onChange={e => handleDebouceChange(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-primary/5 blur-xl rounded-xl" />
    </motion.div>
  );
}
