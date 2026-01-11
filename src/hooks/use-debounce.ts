import { useEffect, useState } from 'react';

/**
 * Hook personalizado para debounce de valores
 * @param value - El valor a debounce
 * @param delay - El delay en milisegundos (por defecto 500ms)
 * @returns El valor debounced
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
