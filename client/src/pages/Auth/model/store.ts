import { createStore } from 'zustand';
import { AuthStage, AuthStore } from './types';
import { createZustandContext } from '@/shared/lib/utils/createZustandContext';

export const { Provider: AuthProvider, useContext: useAuth } = createZustandContext<AuthStore>(() => createStore((set) => ({
    authStage: 'welcome',
    changeAuthStage: (stage: AuthStage) => set({ authStage: stage })
})));