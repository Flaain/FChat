import React from "react";
import { UserCheckType } from "@/shared/model/types";
import { signupAPI } from "../api";
import { otpAPI } from "@/features/OTP";
import { OtpType } from "@/features/OTP/model/types";
import { useOtp } from "@/features/OTP/model/store";
import { useProfile } from "@/entities/profile";
import { useSession } from "@/entities/session";
import { checkFormErrors } from "@/shared/lib/utils/checkFormErrors";
import { steps } from "../model/constants";
import { useAuth } from "@/pages/Auth";
import { FieldPath, useForm } from "react-hook-form";
import { SignupSchemaType } from "../model/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../model/schema";

export const useSignup = () => {
    const [step, setStep] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    
    const form = useForm<SignupSchemaType>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
            login: '',
            birthDate: '',
            otp: ''
        },
        disabled: false,
        mode: 'all',
        shouldFocusError: true
    })
    
    const isNextButtonDisabled =
    !form.getValues(steps[step].fields).every(Boolean) ||
    !!Object.entries(form.formState.errors).some(([key]) => steps[step].fields.includes(key as FieldPath<SignupSchemaType>)) ||
    loading;
    
    React.useEffect(() => {
        setTimeout(form.setFocus, 0, steps[step].fields[0]);
    }, [step])
    
    const changeAuthStage = useAuth((state) => state.changeAuthStage);

    const onSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
        try {
            event?.preventDefault?.();
            
            const data = form.getValues();
            
            const isValid = await form.trigger(steps[step].fields, { shouldFocus: true });
            
            if (!isValid) return;

            setLoading(true);

            const actions = {
                0: async () => {
                    await signupAPI.check({ type: UserCheckType.EMAIL, email: data.email.toLowerCase().trim() });

                    setStep((prevState) => prevState + 1);
                },
                1: async () => {
                    await signupAPI.check({ type: UserCheckType.LOGIN, login: data.login.toLowerCase().trim() });
                    
                    const { data: { retryDelay } } = await otpAPI.create({ email: data.email, type: OtpType.EMAIL_VERIFICATION });
                    
                    useOtp.setState({ otp: { targetEmail: data.email, type: OtpType.EMAIL_VERIFICATION, retryDelay } });
                    
                    setStep((prevState) => prevState + 1);
                },
                2: async () => {
                    const { confirmPassword, ...rest } = data;
                    
                    const { data: profile } = await signupAPI.signup(rest);

                    useProfile.setState({ profile });
                    useSession.getState().actions.onSignin(profile._id);
                }
            };

            await actions[step as keyof typeof actions]();
        } catch (error) {
            checkFormErrors({
                error,
                form,
                fields: steps[step].fields,
                cb: ({ path }) => path === 'otp' && form.resetField('otp', { keepError: true })
            });
        } finally {
            setLoading(false);
        }
    };

    const onBack = () => {
        if (!step) return changeAuthStage('welcome');

        form.resetField('otp');

        setStep((prevState) => prevState - 1);
    }

    return {
        loading,
        isLastStep: step === steps.length - 1,
        step,
        form,
        isNextButtonDisabled,
        changeAuthStage,
        onSubmit,
        onBack
    }
}