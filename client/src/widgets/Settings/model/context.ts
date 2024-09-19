import { createStore } from 'zustand';
import { SettingsStore } from './types';
import { prevMenu } from './constants';
import { createZustandContext } from '@/shared/lib/utils/createZustandContext';

export const { Provider: SettingsProvider, useContext: useSettings } = createZustandContext<SettingsStore>(() => createStore((set, get) => ({
    currentMenu: 'main',
    onBack: () => set({ currentMenu: prevMenu[get().currentMenu as keyof typeof prevMenu] }),
    onMenuChange: (menu) => set({ currentMenu: menu })
})));
