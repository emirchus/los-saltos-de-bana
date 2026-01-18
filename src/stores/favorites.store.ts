import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesStore {
  favorites: number[];
  toggleFavorite: (productId: number) => void;
  addFavorite: (productId: number) => void;
  removeFavorite: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: (productId) => {
        const state = get();
        const isCurrentlyFavorite = state.favorites.includes(productId);
        
        set({
          favorites: isCurrentlyFavorite
            ? state.favorites.filter(id => id !== productId)
            : [...state.favorites, productId],
        });
      },

      addFavorite: (productId) => {
        const state = get();
        if (!state.favorites.includes(productId)) {
          set({
            favorites: [...state.favorites, productId],
          });
        }
      },

      removeFavorite: (productId) => {
        set({
          favorites: get().favorites.filter(id => id !== productId),
        });
      },

      isFavorite: (productId) => {
        return get().favorites.includes(productId);
      },
    }),
    {
      name: 'store-favorites',
      version: 1,
    }
  )
);
