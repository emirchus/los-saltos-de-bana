import { create } from 'zustand';

interface UIStore {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
  jumpsChecked: number[];
  toggleJumpChecked: (id: number | number[]) => void;
}

export const useUIStore = create<UIStore>(set => ({
  isSidebarOpen: false,
  setIsSidebarOpen: isSidebarOpen => set({ isSidebarOpen }),
  jumpsChecked: [],
  toggleJumpChecked: id =>
    set(state => {
      if (Array.isArray(id)) {
        // Toggle all jumps in the array
        const newJumpsChecked = state.jumpsChecked.filter(jumpId => !id.includes(jumpId));
        if (newJumpsChecked.length === state.jumpsChecked.length) {
          // If none were removed, add all
          return { jumpsChecked: [...state.jumpsChecked, ...id] };
        }
        return { jumpsChecked: newJumpsChecked };
      } else {
        // Toggle single jump
        const isChecked = state.jumpsChecked.includes(id);
        if (isChecked) {
          return { jumpsChecked: state.jumpsChecked.filter(jumpId => jumpId !== id) };
        }
        return { jumpsChecked: [...state.jumpsChecked, id] };
      }
    }),
}));
