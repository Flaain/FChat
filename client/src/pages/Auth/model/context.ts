import { createZustandContext } from '@/shared/lib/utils/createZustandContext';
import { createStore } from 'zustand';
import { AuthStore } from './types';

export const { Provider: AuthProvider, useContext: useAuth } = createZustandContext<AuthStore>(() => createStore((set) => ({
    authStage: 'welcome',
    changeAuthStage: (stage) => set({ authStage: stage })
})));