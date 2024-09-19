import { ProfileStore } from './types';
import { useSession } from '@/entities/session/model/store';
import { profileAPI } from '../api';
import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';
import { toast } from 'sonner';
import { imageValidators } from './constants';
import { debounce } from '@/shared/lib/utils/debounce';
import { useModal } from '@/shared/lib/providers/modal';
import { sessionAPI } from '@/entities/session';

export const useProfile = createWithEqualityFn<ProfileStore>((set, get) => ({
    profile: null!,
    isUploadingAvatar: false,
    setProfile: (profile) => set((prevState) => ({ profile: { ...prevState.profile, ...profile } })),
    destroy: () => set({}, true),
    getProfile: async () => {
        try {
            const { data } = await profileAPI.getProfile();

            set({ profile: data });

            sessionAPI.subscribeRefreshError(useSession.getState().onLogout);
            useSession.getState().onAuth(data._id);
        } catch (error) {
            console.error(error);
            useSession.getState().onLogout();
        }
    },
    handleUploadAvatar: async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files?.length || get().isUploadingAvatar) return;

        try {
            set({ isUploadingAvatar: true });

            const file = event.target.files[0];
            const validator = imageValidators.find(({ isValid }) => !isValid(file));

            if (validator) return toast.error(validator.message, { position: 'top-center' });
            
            const form = new FormData();
            const blob = new Blob([file], { type: file.type });

            form.append('image', blob);
            
            const { data } = await profileAPI.avatar(form);

            set((prevState) => ({ profile: { ...prevState.profile, avatar: data } }));
        } catch (error) {
            console.error(error);
            toast.error('Cannot upload image', { position: 'top-center' });
        } finally {
            set({ isUploadingAvatar: false });
        }
    },
    handleChangeStatus: debounce((value: string) => {
        useModal.getState().onAsyncActionModal(() => profileAPI.status({ status: value }), {
            onResolve: () => set((prevState) => ({ profile: { ...prevState.profile, status: value } })),
            closeOnSuccess: false,
            closeOnError: false
        });
    }, 500)
}), shallow);

useProfile.getState().getProfile();