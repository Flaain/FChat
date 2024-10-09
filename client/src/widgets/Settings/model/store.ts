import { createZustandContext } from '@/shared/lib/utils/createZustandContext';
import { SettingMenu, SettingsStore } from './types';
import { createStore } from 'zustand';
import { prevMenu } from './constants';

export const { Provider: SettingsProvider, useContext: useSettings } = createZustandContext<SettingsStore>(() => createStore((set) => ({
    menu: 'main',
    actions: {
        onBack: () => set((prevState) => ({ menu: prevMenu[prevState.menu as keyof typeof prevMenu] })),
        onMenuChange: (menu: SettingMenu) => set({ menu })
    }
})));