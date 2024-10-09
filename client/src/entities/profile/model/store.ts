import { create } from 'zustand';
import { ProfileStore } from './types';
import { profileActions } from './actions';

export const useProfile = create<ProfileStore>((set, get) => ({
    profile: null!,
    isUploadingAvatar: false,
    actions: profileActions(set, get)
}));

useProfile.getState().actions.getProfile();