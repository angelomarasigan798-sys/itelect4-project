import { create } from 'zustand';

interface UIStore {
  search: string;
  setSearch: (search: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  search: '',
  setSearch: (search) => set({ search }),
  darkMode: false,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}));
