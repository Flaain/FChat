import React from 'react';
import { FieldPath, useForm } from 'react-hook-form';
import { ChangePasswordSchemaType } from '../../model/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/shared/api';
import { ActionPasswordType } from '@/shared/model/types';
import { AppException } from '@/shared/api/error';
import { toast } from 'sonner';
import { useModal } from '@/shared/lib/hooks/useModal';
import { changePasswordSchema } from '../../model/schema';

const steps: Array<{ fields: Array<FieldPath<ChangePasswordSchemaType>> }> = [
    { fields: ['currentPassword'] },
    { fields: ['newPassword'] }
];

export const useChangePassword = () => {
    const { closeModal } = useModal();

    const [step, setStep] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(false);

    const form = useForm<ChangePasswordSchemaType>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: ''
        },
        disabled: isLoading,
        mode: 'onSubmit'
    });

    React.useEffect(() => {
        form.setFocus('currentPassword');
    }, [])

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault()

            const isValid = await form.trigger(steps[step].fields, { shouldFocus: true });

            if (!isValid) return;

            const { currentPassword, newPassword } = form.getValues();

            setIsLoading(true);

            const actions = {
                0: async () => {
                    await api.user.password({ type: ActionPasswordType.CHECK, currentPassword });

                    setStep((prevState) => prevState + 1);
                },
                1: async () => {
                    await api.user.password({ type: ActionPasswordType.SET, currentPassword, newPassword });

                    closeModal();
                    toast.success('Password changed successfully', { position: 'top-center' });
                    // maybe we can even logout user or it's better wait to access token expiration 
                }
            };

            await actions[step as keyof typeof actions]();
        } catch (error) {
            console.error(error);
            if (error instanceof AppException) {
                error.errors?.forEach(({ path, message }) => {
                    form.setError(path as FieldPath<ChangePasswordSchemaType>, { message });
                });

                !error.errors && toast.error(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { form, step, setStep, onSubmit };
};