import { useForm } from 'react-hook-form';
import { EditNameType } from '../../model/types';
import { useProfile } from '@/shared/lib/hooks/useProfile';
import { zodResolver } from '@hookform/resolvers/zod';
import { editNameSchema } from '../../model/schema';
import React from 'react';

export const useEditName = () => {
    const { profile } = useProfile();

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

    const onSubmit = ({ name }: EditNameType) => {
        console.log(name);
    };

    return {
        form,
        onSubmit
    };
};