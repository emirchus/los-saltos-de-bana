import { useCallback, useEffect, useRef, useState } from 'react';

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
/**
 * Hook para recibir un callback y ejecutarlo después de un delay
 * @param callback - El callback a ejecutar
 * @param delay - El delay en milisegundos (por defecto 500ms)
 * @returns El callback debounced
 */
export function useDebounceCallback<T>(callback: (value: T) => void, delay: number = 500): (value: T) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  // Mantener la referencia del callback actualizada
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Limpiar el timeout al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedCallback = useCallback(
    (value: T) => {
      // Cancelar el timeout anterior si existe
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Crear un nuevo timeout
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(value);
      }, delay);
    },
    [delay]
  );

  return debouncedCallback;
}
