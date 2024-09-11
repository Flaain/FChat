import { create } from 'zustand';
import { ThemeStore } from './types';
import { getTheme } from '@/entities/theme/lib/getTheme';

export const useTheme = create<ThemeStore>((set) => ({
    theme: getTheme(),
    setTheme: (theme) => set({ theme })
}));