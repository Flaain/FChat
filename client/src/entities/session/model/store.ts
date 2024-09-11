import { create } from 'zustand';
import { SessionStore } from './types';

export const useSession = create<SessionStore>((set) => ({
    userId: null!,
    isAuthorized: false,
    isAuthInProgress: true,
    onAuth: (userId: string) => set({ isAuthInProgress: false, isAuthorized: true, userId }),
    onLogout: () => set({ isAuthInProgress: false, isAuthorized: false, userId: null! })
}));