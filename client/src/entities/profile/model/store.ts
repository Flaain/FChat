import { create } from 'zustand';
import { ProfileStore } from './types';
import { useSession } from '@/entities/session/model/store';
import { profileApi } from '../api';

export const useProfile = create<ProfileStore>((set) => ({
    profile: null!,
    setProfile: (profile) => set((prevState) => ({ profile: { ...prevState.profile, ...profile } })),
    resetProfile: () => set({ profile: null! }),
    getProfile: async () => {
        try {
            const { data } = await profileApi.getProfile();

            set({ profile: data });

            useSession.getState().onAuth(data._id);
        } catch (error) {
            console.error(error);
            useSession.getState().onLogout();
        }
    }
}));