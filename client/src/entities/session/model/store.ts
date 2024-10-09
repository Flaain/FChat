import { create } from 'zustand';
import { SessionStore } from './types';
import { useProfile } from '@/entities/profile';

export const useSession = create<SessionStore>((set) => ({
    userId: null!,
    isAuthInProgress: true,
    isAuthorized: false,
    actions: {
        onSignin: (userId) => set({ userId, isAuthorized: true, isAuthInProgress: false }),
        onSignout: () => {
            set({ userId: null!, isAuthorized: false, isAuthInProgress: false });
            useProfile.setState({ profile: null! });
        }
    }
}));