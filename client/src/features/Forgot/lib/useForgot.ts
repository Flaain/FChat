import React from 'react';
import { FieldPath, useForm } from 'react-hook-form';
import { ForgotSchemaType } from '../model/types';
import { toast } from 'sonner';
import { forgotAPI } from '../api';
import { forgotSchema } from '../model/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { otpAPI, useOtp } from '@/features/OTP';
import { OtpType } from '@/features/OTP/model/types';
import { checkFormErrors } from '@/shared/lib/utils/checkFormErrors';
import { useSigninForm } from '@/widgets/SigninForm/model/context';
import { steps } from '../model/constants';

export const useForgot = () => {
    const [step, setStep] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(false);
    
    const setOtp = useOtp((state) => state.setOtp);
    const setStage = useSigninForm((state) => state.setStage);

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

    React.useEffect(() => {
        setTimeout(form.setFocus, 0, steps[step].fields[0]);
    }, [])

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
                    await otpAPI.verify({ otp, email, type: OtpType.PASSWORD_RESET });

                    setStep((prevState) => prevState + 1);
                },
                2: async () => {
                    await forgotAPI.reset({ email, password, otp });

                    toast.success('Password changed successfully', { 
                        position: 'top-center', 
                        description: 'You can now sign in with your new password' 
                    });
                    
                    setStage('signin');
                }
            }

            await actions[step as keyof typeof actions]();
        } catch (error) {
            console.error(error);
            checkFormErrors({ error, form, step, steps });
        } finally {
            setIsLoading(false);
        }
    };

    const onBack = React.useCallback(() => {
        !step ? setStage('signin') : setStep((prevState) => prevState - 1)
    }, [step]);

    return { form, step, isLoading, onSubmit, onBack, isNextButtonDisabled: checkNextAvailability() };
};