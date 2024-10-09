import React from 'react';
import { FieldPath, useForm } from 'react-hook-form';
import { ForgotSchemaType } from '../model/types';
import { toast } from 'sonner';
import { forgotAPI } from '../api';
import { forgotSchema } from '../model/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { otpAPI } from '@/features/OTP';
import { checkFormErrors } from '@/shared/lib/utils/checkFormErrors';
import { steps } from '../model/constants';
import { useOtp } from '@/features/OTP/model/store';
import { useSigninForm } from '@/widgets/SigninForm/model/store';
import { OtpType } from '@/features/OTP/model/types';

export const useForgot = () => {
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
    
    React.useEffect(() => {
        setTimeout(form.setFocus, 0, steps[step].fields[0]);
    }, [])
    
    const isNextButtonDisabled = (
        !form.getValues(steps[step].fields).every(Boolean) ||
        !!Object.entries(form.formState.errors).some(([key]) => steps[step].fields.includes(key as FieldPath<ForgotSchemaType>)) || isLoading
        );
        
    const changeAuthStage = useSigninForm((state) => state.changeSigninStage);

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

                    useOtp.setState({ otp: { targetEmail: email, type: OtpType.PASSWORD_RESET, retryDelay } });
                    
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
                    
                    changeAuthStage('signin');
                }
            }

            await actions[step as keyof typeof actions]();
        } catch (error) {
            console.error(error);
            checkFormErrors({ error, form, fields: steps[step].fields });
        } finally {
            setIsLoading(false);
        }
    };

    const onBack = React.useCallback(() => {
        !step ? changeAuthStage('signin') : setStep((prevState) => prevState - 1)
    }, [step]);

    return { form, step, isLoading, onSubmit, onBack, isNextButtonDisabled };
};