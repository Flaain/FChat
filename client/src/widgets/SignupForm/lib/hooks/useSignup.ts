import React from "react";
import { FieldPath, useForm } from "react-hook-form";
import { SignupSchemaType } from "../../model/types";
import { useProfile } from "@/shared/lib/hooks/useProfile";
import { useSession } from "@/entities/session/lib/hooks/useSession";
import { signupSchema } from "../../model/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserCheckType } from "@/shared/model/types";
import { AppException } from "@/shared/api/error";
import { OtpType } from "@/shared/lib/contexts/otp/types";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import { useOtp } from "@/shared/lib/hooks/useOtp";
import { signupAPI } from "../../api";
import { api } from "@/shared/api";

const steps: Array<{ fields: Array<FieldPath<SignupSchemaType>> }> = [
    { fields: ["email", "password", "confirmPassword"] },
    { fields: ["name", 'login', "birthDate"] },
    { fields: ["otp"] },
];

export const useSignup = () => {
    const { setOtp } = useOtp();
    const { setAuthStage } = useAuth();
    const { setProfile } = useProfile();
    const { dispatch } = useSession();

    const [step, setStep] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    
    const form = useForm<SignupSchemaType>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            name: "",
            login: "",
            birthDate: "",
            otp: "",
        },
        disabled: loading,
        mode: "all",
        shouldFocusError: true,
    });

    React.useEffect(() => {
        setTimeout(form.setFocus, 0, steps[step].fields[0]);
    }, [step])

    const checkNextAvailability = () => {
        return (
            !form.getValues(steps[step].fields).every(Boolean) ||
            !!Object.entries(form.formState.errors).some(([key]) => steps[step].fields.includes(key as FieldPath<SignupSchemaType>)) ||
            loading
        );
    };

    const onSubmit = React.useCallback(async (event?: React.FormEvent<HTMLFormElement>) => {
        try {
            event?.preventDefault?.();
            
            const data = form.getValues();

            if (step === 2 && data.otp.length !== 6) return;
            /* cannot use zod min(6) cuz of immediately error after OTP component render. 
               Error keeps showing on every change cuz of revalidation mode. It's okay for another fields
               but not for OTP. So decided to use manual validation. 
            */

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

                    const { data: { retryDelay } } = await api.otp.create({ email: data.email, type: OtpType.EMAIL_VERIFICATION });

                    setOtp({ type: OtpType.EMAIL_VERIFICATION, retryDelay });
                    setStep((prevState) => prevState + 1);
                },
                2: async () => {
                    const { confirmPassword, ...rest } = data;
                    
                    const { data: profile } = await signupAPI.signup(rest);

                    setProfile(profile);
                }
            };

            await actions[step as keyof typeof actions]();
        } catch (error) {
            console.error(error);
            if (error instanceof AppException) {
                error.errors?.forEach(({ path, message }) => {
                    if (steps[step].fields.includes(path as FieldPath<SignupSchemaType>)) {
                        form.setError(path as FieldPath<SignupSchemaType>, { message }, { shouldFocus: true });
                    }
                });
                
                !error.errors && error.toastError();
            }
        } finally {
            setLoading(false);
        }
    }, [dispatch, form, setProfile, step]);

    const onBack = React.useCallback(() => {
        if (!step) return setAuthStage("welcome");

        form.resetField('otp');

        setStep((prevState) => prevState - 1);
    }, [setAuthStage, step]);

    return {
        form,
        step,
        loading,
        stepsLength: steps.length,
        isLastStep: step === steps.length - 1,
        isNextButtonDisabled: checkNextAvailability(),
        onBack,
        onSubmit,
    };
};