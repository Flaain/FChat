import React from "react";
import { steps } from "./constants";
import { FieldPath, useForm } from "react-hook-form";
import { ISignupContext, SignupSchemaType } from "./types";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "./schema";
import { signupAPI } from "../api";
import { UserCheckType } from "@/shared/model/types";
import { otpAPI, useOtp } from "@/features/OTP";
import { OtpType } from "@/features/OTP/model/types";
import { useProfile } from "@/entities/profile";
import { useSession } from "@/entities/session";
import { checkFormErrors } from "@/shared/lib/utils/checkFormErrors";
import { SignupContext } from "./context";

export const SignupProvider = ({ children }: { children: React.ReactNode; }) => {
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

    const onSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
        try {
            event?.preventDefault?.();
            
            const data = form.getValues();

            if (step === 2 && data.otp.length !== 6) return;

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
                    
                    setStep((prevState) => prevState + 1);

                    useOtp.getState().setOtp({ targetEmail: data.email, type: OtpType.EMAIL_VERIFICATION, retryDelay });
                },
                2: async () => {
                    const { confirmPassword, ...rest } = data;
                    
                    const { data: profile } = await signupAPI.signup(rest);

                    useProfile.getState().setProfile(profile);
                    useSession.getState().onAuth(profile._id);
                }
            };

            await actions[step as keyof typeof actions]();
        } catch (error) {
            checkFormErrors({ error, form, fields: steps[step].fields });
        } finally {
            setLoading(false);
        }
    };

    const onBack = () => {
        if (!step) return changeAuthStage('welcome');

        form.resetField('otp');

        setStep((prevState) => prevState - 1);
    }

    const value: ISignupContext = {
        form,
        isLastStep: step === steps.length - 1,
        loading,
        step,
        onSubmit,
        onBack,
        isNextButtonDisabled
    }
    
    return (
        <SignupContext.Provider value={value}>
            {children}
        </SignupContext.Provider>
    )
}