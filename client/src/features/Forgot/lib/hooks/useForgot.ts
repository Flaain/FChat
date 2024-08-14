import React from 'react';
import { FieldPath, useForm } from 'react-hook-form';
import { ForgotSchemaType } from '../../model/types';
import { useOtp } from '@/shared/lib/hooks/useOtp';
import { api } from '@/shared/api';
import { OtpType } from '@/shared/lib/contexts/otp/types';
import { AppException } from '@/shared/api/error';
import { toast } from 'sonner';
import { forgotAPI } from '../../api';
import { forgotSchema } from '../../model/schema';
import { useSigninForm } from '@/widgets/SigninForm/lib/hooks/useSigninForm';
import { zodResolver } from '@hookform/resolvers/zod';

const steps: Array<{ fields: Array<FieldPath<ForgotSchemaType>> }> = [
    { fields: ['email'] },
    { fields: ['otp'] },
    { fields: ['password', 'confirmPassword'] }
];

export const useForgot = () => {
    const { setStage } = useSigninForm();
    const { setOtp } = useOtp();

    const [step, setStep] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(false);
    
    const form = useForm<ForgotSchemaType>({
        resolver: zodResolver(forgotSchema),
        defaultValues: {
            email: '',
            otp: '',
            password: '',
            confirmPassword: ''
        },
        mode: 'all',
        shouldFocusError: true
    });

    const checkNextAvailability = () => {
        return (
            !form.getValues(steps[step].fields).every(Boolean) ||
            !!Object.entries(form.formState.errors).some(([key]) => steps[step].fields.includes(key as FieldPath<ForgotSchemaType>)) || isLoading
        );
    };

    const onSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
        try {
            event?.preventDefault?.();

            setIsLoading(true);

            const isValid = await form.trigger(steps[step].fields);

            if (!isValid) return;
            
            const { otp, email, password } = form.getValues();

            const actions = {
                0: async () => {
                    const { data: { retryDelay } } = await forgotAPI.forgot({ email });

                    setOtp({ retryDelay, type: OtpType.PASSWORD_RESET });
                    setStep((prevState) => prevState + 1);
                },
                1: async () => {
                    await api.otp.verify({ otp, email, type: OtpType.PASSWORD_RESET });

                    setStep((prevState) => prevState + 1);
                },
                2: async () => {
                    await forgotAPI.reset({ email, password, otp });

                    toast.success('Password changed successfully', { position: 'top-center' });
                    
                    setStage('signin');
                }
            }

            await actions[step as keyof typeof actions]();
        } catch (error) {
            console.error(error);
            if (error instanceof AppException) {
                error.errors?.forEach(({ path, message }) => {
                    if (steps[step].fields.includes(path as FieldPath<ForgotSchemaType>)) {
                        form.setError(path as FieldPath<ForgotSchemaType>, { message }, { shouldFocus: true });
                    }
                });
                
                !error.errors && error.toastError();
            }
        } finally {
            setIsLoading(false);
        }
    };

    const onBack = () => {
        !step ? setStage('signin') : setStep((prevState) => prevState - 1);
    }

    return { form, step, isLoading, onSubmit, onBack, isNextButtonDisabled: checkNextAvailability() };
};