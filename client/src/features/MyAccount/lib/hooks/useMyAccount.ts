import React from 'react';
import { useProfile } from '@/shared/lib/hooks/useProfile';
import { debounce } from '@/shared/lib/utils/debounce';
import { api } from '@/shared/api';
import { MAX_STATUS_SIZE, STOP_SIZE, imageValidators } from '../../model/constants';
import { toast } from 'sonner';

export const useMyAccount = () => {
    const { profile: { status, avatar }, setProfile } = useProfile();

    const [symbolsLeft, setSymbolsLeft] = React.useState(MAX_STATUS_SIZE - (status?.length ?? 0));
    const [statusValue, setStatusValue] = React.useState(status ?? '');
    const [isUploading, setIsUploading] = React.useState(false);

    const handleChangeStatus = ({ nativeEvent, target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
        const trimmedValue = value.trim();

        if ((nativeEvent && 'inputType' in nativeEvent && nativeEvent.inputType === 'insertLineBreak') || value.length >= STOP_SIZE) return;

        setStatusValue(value);
        setSymbolsLeft(MAX_STATUS_SIZE - value.length);

        trimmedValue.length <= MAX_STATUS_SIZE && handleSetStatus(trimmedValue);
    };

    const handleSetStatus = React.useCallback(debounce(async (value: string) => {
        try {
            await api.user.status({ status: value });

            setProfile((prevState) => ({ ...prevState, status: value }));
        } catch (error) {
            console.error(error);
        }
    }, 500), []);

    const handleChangeAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files?.length || isUploading) return;

        try {
            setIsUploading(true);

            const file = event.target.files[0];
            const validator = imageValidators.find(({ isValid }) => !isValid(file));

            if (validator) return toast.error(validator.message, { position: 'top-center' });
            
            const form = new FormData();
            const blob = new Blob([file], { type: file.type });

            form.append('image', blob);
            
            const { data: { url } } = await api.user.avatar(form);

            avatar && URL.revokeObjectURL(avatar);
            
            const imageURL = URL.createObjectURL(await (await fetch(url)).blob());

            setProfile((prevState) => ({ ...prevState, avatar: imageURL }));
        } catch (error) {
            console.error(error);

            setProfile((prevState) => ({ ...prevState, avatar: undefined }));

            toast.error('Cannot upload image', { position: 'top-center' });
        } finally {
            setIsUploading(false);
        }
    }

    return {
        symbolsLeft,
        statusValue,
        isUploading,
        handleChangeStatus,
        handleChangeAvatar,
    };
};