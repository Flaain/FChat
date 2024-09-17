import { ProfileStore } from './types';
import { useSession } from '@/entities/session/model/store';
import { profileApi } from '../api';
import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';

export const useProfile = createWithEqualityFn<ProfileStore>((set) => ({
    profile: null!,
    setProfile: (profile) => set((prevState) => ({ profile: { ...prevState.profile, ...profile } })),
    destroy: () => set({}, true),
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
}), shallow);