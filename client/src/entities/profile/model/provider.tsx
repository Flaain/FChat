import React from 'react';
import { Profile } from '@/shared/model/types';
import { profileAPI } from '../api';
import { sessionAPI, useSession } from '@/entities/session';
import { SessionTypes } from '@/entities/session/model/types';
import { imageValidators } from './constants';
import { toast } from 'sonner';
import { ProfileContext } from './context';

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
    const { dispatch } = useSession();

    const [profile, setProfile] = React.useState<Profile>(null!);
    const [isUploadingAvatar, setIsUploadingAvatar] = React.useState(false);

    React.useEffect(() => {
        const errorSubscriber = () => dispatch({ type: SessionTypes.LOGOUT });

        (async () => {
            try {
                const { data } = await profileAPI.getProfile();

                setProfile(data);

                sessionAPI.subscribeRefreshError(errorSubscriber);

                dispatch({ type: SessionTypes.AUTH, payload: { userId: data._id } });
            } catch (error) {
                console.error(error);
                dispatch({ type: SessionTypes.LOGOUT });
            }
        })();

        return () => {
            sessionAPI.unsubscribeRefreshError(errorSubscriber);
        };
    }, []);

    const handleUploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files?.length || isUploadingAvatar) return;

        try {
            setIsUploadingAvatar(true);

            const file = event.target.files[0];
            const validator = imageValidators.find(({ isValid }) => !isValid(file));

            if (validator) return toast.error(validator.message, { position: 'top-center' });

            const form = new FormData();
            const blob = new Blob([file], { type: file.type });

            form.append('image', blob);

            const { data } = await profileAPI.avatar(form);

            setProfile((prevState) => ({ ...prevState, avatar: data }));
        } catch (error) {
            console.error(error);
            toast.error('Cannot upload image', { position: 'top-center' });
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    return (
        <ProfileContext.Provider
            value={{
                profile,
                isUploadingAvatar,
                handleUploadAvatar
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
};