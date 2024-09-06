import React from 'react';
import { useForm } from 'react-hook-form';
import { EditNameType } from '../../model/types';
import { useProfile } from '@/shared/lib/hooks/useProfile';
import { zodResolver } from '@hookform/resolvers/zod';
import { editNameSchema } from '../../model/schema';
import { api } from '@/shared/api';
import { toast } from 'sonner';
import { useModal } from '@/shared/lib/hooks/useModal';

export const useEditName = () => {
    const { closeModal } = useModal();
    const { profile, setProfile } = useProfile();

    const form = useForm<EditNameType>({
        resolver: zodResolver(editNameSchema),
        defaultValues: {
            name: profile.name
        },
        mode: 'onSubmit'
    });

    React.useEffect(() => {
        form.setFocus('name');
    }, [])

    const onSubmit = async (data: EditNameType) => {
        try {
            if (data.name.trim() === profile.name) return;

            await api.user.name(data);

            setProfile({ ...profile, name: data.name.trim() });
        } catch (error) {
            console.log(error);
            toast.error('Failed to change name');
        } finally {
            closeModal();
        }
    };

    return {
        form,
        onSubmit
    };
};