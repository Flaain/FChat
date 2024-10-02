import { create } from 'zustand';
import { ProfileStore } from './types';
import { debounce } from '@/shared/lib/utils/debounce';
import { profileAPI } from '..';
import { imageValidators } from './constants';
import { toast } from 'sonner';
import { useSession } from '@/entities/session';

export const useProfile = create<ProfileStore>((set, get) => ({
    profile: null!,
    isUploadingAvatar: false,
    actions: {
        getProfile: async () => {
            try {
                const { data } = await profileAPI.getProfile();

                set({ profile: data });

                useSession.getState().actions.onSignin(data._id);
            } catch (error) {
                console.error(error);
            } finally {
                useSession.setState({ isAuthInProgress: false });
            }
        },
        handleSetStatus: debounce(async (status: string) => {
            try {
                await profileAPI.status({ status });

                set((prevState) => ({ profile: { ...prevState.profile, status } }));
            } catch (error) {
                console.error(error);
            }
        }),
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

                event.target.value = ''; // reset value to prevent caching
            } finally {
                set({ isUploadingAvatar: false });
            }
        }
    }
}));