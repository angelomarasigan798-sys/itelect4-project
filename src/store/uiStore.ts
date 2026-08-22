import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIStore {
  search: string;
  setSearch: (search: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      search: '',
      setSearch: (search) => set({ search }),
      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    }),
    {
      name: 'careline-ui-store',
    },
  ),
);
