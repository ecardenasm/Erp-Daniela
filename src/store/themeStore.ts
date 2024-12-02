import { create } from 'zustand';

type ThemeColor = 'yellow' | 'emerald' | 'indigo';
type ThemeMode = 'light' | 'dark';

interface ThemeState {
  color: ThemeColor;
  mode: ThemeMode;
  isCollapsed: boolean;
  textColor: string;
  bgColor: string;
  setColor: (color: ThemeColor) => void;
  setMode: (mode: ThemeMode) => void;
  toggleCollapsed: () => void;
}

const getTextColor = (color: ThemeColor, mode: ThemeMode): string => {
  if (mode === 'dark') {
    return {
      yellow: '#fdfdfd',
      emerald: '#fdfdfd',
      indigo: '#e4e4e7',
    }[color];
  }
  return {
    yellow: '#111827',
    emerald: '#065f46',
    indigo: '#1e3a8a',
  }[color];
};

const getBgColor = (color: ThemeColor, mode: ThemeMode): string => {
  if (mode === 'dark') {
    return {
      yellow: '#78350f',
      emerald: '#064e3b',
      indigo: '#312e81',
    }[color];
  }
  return {
    yellow: '#fef3c7',
    emerald: '#d1fae5',
    indigo: '#c7d2fe',
  }[color];
};

export const useThemeStore = create<ThemeState>((set) => ({
  color: 'yellow',
  mode: 'light',
  isCollapsed: false,
  textColor: getTextColor('yellow', 'light'),
  bgColor: getBgColor('yellow', 'light'),
  setColor: (color) =>
    set((state) => ({
      color,
      textColor: getTextColor(color, state.mode),
      bgColor: getBgColor(color, state.mode),
    })),
  setMode: (mode) =>
    set((state) => ({
      mode,
      textColor: getTextColor(state.color, mode),
      bgColor: getBgColor(state.color, mode),
    })),
  toggleCollapsed: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
}));
