import { create } from 'zustand';

type ThemeColor = 'yellow' | 'emerald' | 'indigo';
type ThemeMode = 'light' | 'dark';

interface ThemeState {
  color: ThemeColor;
  mode: ThemeMode;
  isCollapsed: boolean;
  setColor: (color: ThemeColor) => void;
  setMode: (mode: ThemeMode) => void;
  toggleCollapsed: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  color: 'yellow',
  mode: 'light',
  isCollapsed: false,
  setColor: (color) => set({ color }),
  setMode: (mode) => set({ mode }),
  toggleCollapsed: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
}));