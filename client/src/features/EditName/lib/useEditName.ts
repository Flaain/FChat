import React from 'react';
import { useForm } from 'react-hook-form';
import { EditNameType } from '../model/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { editNameSchema } from '../model/schema';
import { toast } from 'sonner';
import { useModal } from '@/shared/lib/providers/modal';
import { profileAPI, useProfile } from '@/entities/profile';

export const useEditName = () => {
    const profile = useProfile((state) => state.profile);
    const onAsyncActionModal = useModal((state) => state.actions.onAsyncActionModal);

    const form = useForm<EditNameType>({
        resolver: zodResolver(editNameSchema),
        defaultValues: {
            name: profile.name
        },
        mode: 'onSubmit'
    });

    React.useEffect(() => {
        form.setFocus('name');
    }, []);

    const onSubmit = async (data: EditNameType) => {
        const name = data.name.trim();

        if (name === profile.name) return;

        onAsyncActionModal(() => profileAPI.name({ name }), {
            onResolve: () => useProfile.setState((prevState) => ({ profile: { ...prevState.profile, name } })),
            onReject: () => toast.error('Failed to change name'),
            closeOnError: true
        });
    };

    return { form, onSubmit };
};