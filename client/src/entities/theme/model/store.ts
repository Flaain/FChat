import { create } from 'zustand';
import { Theme } from './types';
import { getTheme } from '../lib/getTheme';

export const useTheme = create<{ theme: Theme }>(() => ({ theme: getTheme() }));