import React from "react";
import { FieldErrors, FieldPath, useForm } from "react-hook-form";
import { useAuth } from "./useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/shared/api";
import { SignupSchemaType } from "../../model/types";
import { signupSchema } from "../../model/schema";
import { useProfile } from "@/shared/lib/hooks/useProfile";
import { useSession } from "@/entities/session/lib/hooks/useSession";
import { SessionTypes } from "@/entities/session/model/types";
import { saveDataToLocalStorage } from "@/shared/lib/utils/saveDataToLocalStorage";
import { localStorageKeys } from "@/shared/constants";
import { toast } from "sonner";
import { ApiError } from "@/shared/api/error";
import { FormErrorsType } from "@/shared/model/types";
import { ZodCustomIssue } from "zod";
import { useOtp } from "./useOtp";

const steps: Array<{ fields: Array<FieldPath<SignupSchemaType>> }> = [
    { fields: ["email", "password", "confirmPassword"] },
    { fields: ["name", "birthDate"] },
    { fields: ["otp"] }
];

export const useSignup = () => {
    const { setAuthStage } = useAuth();
    const { setProfile } = useProfile();
    const { dispatch } = useSession();
    const { setOtp } = useOtp();

    const [step, setStep] = React.useState(0);
    const [loading, setLoading] = React.useState(false);

    const form = useForm<SignupSchemaType>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            name: "",
            birthDate: "",
            otp: "",
        },
        disabled: loading,
        mode: "all",
        shouldFocusError: true,
    });

    const formRef = React.useRef<HTMLFormElement>(null);

    const checkNextAvailability = () => {
        return (
            !form.getValues(steps[step].fields).every(Boolean) ||
            !!Object.entries(form.formState.errors).some(([key]) => steps[step].fields.includes(key as FieldPath<SignupSchemaType>)) ||
            loading
        );
    };

    const displayErrorsFromAPI = React.useCallback(([key, { message }]: FormErrorsType) => {
        form.setError(key as FieldPath<SignupSchemaType>, { message }, { shouldFocus: true });
    }, [form]);

    const onSubmit = React.useCallback(async (event?: React.FormEvent<HTMLFormElement>) => {
        try {
            event?.preventDefault?.();
            
            const data = form.getValues();

            if (step === 2 && data.otp.length !== 6) return; 
            /* cannot use zod min(6) cuz of immediately error after OTP component render. 
               Error keeps showing on every change cuz of revalidation mode. It's okay for another fields
               but not for OTP. So decided to use manual validation. 
            */

            const isValid = await form.trigger(steps[step].fields, { shouldFocus: true })
            
            if (!isValid) return;

            setLoading(true);

            const actions = {
                0: async () => {
                    await api.user.checkEmailBeforeSignup({ body: { email: data.email } });

                    setStep((prevState) => prevState + 1);
                },
                1: async () => {
                    const prom = await new Promise((resolve) => {
                        setTimeout(() => {
                            resolve(true);
                        }, 2000);
                    })

                    setOtp({ resource: 'signup', type: 'email_verification', retryDelay: 120000 });
                    setStep((prevState) => prevState + 1);
                },
                2: async () => {
                    const { confirmPassword, ...rest } = data;
                    
                    const prom = await new Promise((resolve, reject) => {
                        setTimeout(() => {
                            reject('Invalid verification code');
                        }, 2000);
                    })

                    console.log(rest);
                    // const { data: { accessToken, expiresIn, ...profile } } = await api.user.signup({ body: rest });

                    // setProfile(profile);
                    // dispatch({ type: SessionTypes.SET_ON_AUTH, payload: { isAuthorized: true, accessToken, userId: profile._id, expiresIn } });
                    // saveDataToLocalStorage({ key: localStorageKeys.TOKEN, data: accessToken });
                }
            };

            await actions[step as keyof typeof actions]();
        } catch (error) {
            console.error(error);
            form.setError('otp', { message: error }, { shouldFocus: true });
        } finally {
            setLoading(false);
        }
    }, [displayErrorsFromAPI, dispatch, form, setProfile, step]);

    const onBack = React.useCallback(() => {
        setStep((prevState) => prevState - 1);
        form.resetField('otp');
        !step && setAuthStage("welcome");
    }, [setAuthStage, step]);

    return {
        form,
        formRef,
        step,
        loading,
        stepsLength: steps.length,
        isLastStep: step === steps.length - 1,
        rootError: form.formState.errors?.root?.serverError,
        isNextButtonDisabled: checkNextAvailability(),
        onBack,
        onSubmit,
    };
};