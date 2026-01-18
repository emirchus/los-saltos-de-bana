'use client';

import { useCallback, useEffect, useState } from 'react';

const FAVORITES_KEY = 'store-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);

  // Cargar favoritos del localStorage al montar
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const stored = localStorage.getItem(FAVORITES_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as number[];
          setFavorites(Array.isArray(parsed) ? parsed : []);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
        setFavorites([]);
      }
    };

    loadFavorites();

    // Escuchar cambios en otras pestañas
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === FAVORITES_KEY) {
        loadFavorites();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Guardar favoritos en localStorage
  const saveFavorites = useCallback((newFavorites: number[]) => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);

      // Disparar evento personalizado para sincronizar en la misma pestaña
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, []);

  const toggleFavorite = useCallback(
    (productId: number) => {
      setFavorites(prev => {
        const newFavorites = prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId];
        saveFavorites(newFavorites);
        return newFavorites;
      });
    },
    [saveFavorites]
  );

  const isFavorite = useCallback(
    (productId: number) => {
      return favorites.includes(productId);
    },
    [favorites]
  );

  const addFavorite = useCallback(
    (productId: number) => {
      if (!favorites.includes(productId)) {
        saveFavorites([...favorites, productId]);
      }
    },
    [favorites, saveFavorites]
  );

  const removeFavorite = useCallback(
    (productId: number) => {
      saveFavorites(favorites.filter(id => id !== productId));
    },
    [favorites, saveFavorites]
  );

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
  };
}
