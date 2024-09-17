import React from 'react';
import { useForm } from 'react-hook-form';
import { EditNameType } from '../model/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { editNameSchema } from '../model/schema';
import { toast } from 'sonner';
import { useModal } from '@/shared/lib/providers/modal';
import { profileAPI, useProfile } from '@/entities/profile';

export const useEditName = () => {
    const { profile, setProfile } = useProfile((state) => ({ profile: state.profile, setProfile: state.setProfile }));

    const onAsyncActionModal = useModal((state) => state.onAsyncActionModal);

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
        if (data.name.trim() === profile.name) return;

        onAsyncActionModal(() => profileAPI.name({ name: data.name.trim() }), {
            onResolve: () => setProfile({ ...profile, name: data.name.trim() }),
            onReject: () => toast.error('Failed to change name'),
            closeOnError: true
        });
    };

    return { form, onSubmit };
};