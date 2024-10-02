import React from 'react';
import { useForm } from 'react-hook-form';
import { ActionPasswordType, ChangePasswordSchemaType } from '../model/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { changePasswordSchema } from '../model/schema';
import { changePasswordAPI } from '../api';
import { checkFormErrors } from '@/shared/lib/utils/checkFormErrors';
import { steps } from '../model/constants';
import { useModal } from '@/shared/lib/providers/modal';
import { selectModalActions } from '@/shared/lib/providers/modal/store';

export const useChangePassword = () => {
    const { onAsyncActionModal } = useModal(selectModalActions);

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
        setTimeout(form.setFocus, 0, steps[step].fields[0]);
    }, [step])

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault()

            const isValid = await form.trigger(steps[step].fields, { shouldFocus: true });

            if (!isValid) return;

            const { currentPassword, newPassword } = form.getValues();

            setIsLoading(true);

            const actions = {
                0: () => onAsyncActionModal(() => changePasswordAPI.changePassword({ type: ActionPasswordType.CHECK, currentPassword }), {
                        onReject: (error) => checkFormErrors({ error, form, fields: steps[step].fields }),
                        onResolve: () => setStep((prevState) => prevState + 1),
                        closeOnSuccess: false
                    }),
                1: () => onAsyncActionModal(() => changePasswordAPI.changePassword({ type: ActionPasswordType.SET, currentPassword, newPassword }), {
                        onReject: (error) => checkFormErrors({ error, form, fields: steps[step].fields }),
                        onResolve: () => toast.success('Password changed successfully', { position: 'top-center' })
                    }),
            };

            await actions[step as keyof typeof actions]();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return { form, step, setStep, onSubmit };
};