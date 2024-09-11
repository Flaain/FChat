import { create } from "zustand";

export type AuthStage = 'welcome' | 'signIn' | 'signUp';

export interface AuthStore {
    authStage: AuthStage;
    changeAuthStage: (stage: AuthStage) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    authStage: 'welcome',
    changeAuthStage: (stage) => set({ authStage: stage })
}));