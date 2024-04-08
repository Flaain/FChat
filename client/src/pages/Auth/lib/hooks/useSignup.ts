import React from "react";
import { FieldPath, useForm } from "react-hook-form";
import { useAuth } from "./useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/shared/api";
import { isSignupFormError } from "@/shared/lib/utils/isApiError";
import { SignupSchema } from "../../model/types";
import { signupSchema } from "../../model/schema";

const steps: Array<{ fields: Array<FieldPath<SignupSchema>> }> = [
    { fields: ["email", "password", "confirmPassword"] },
    { fields: ["name", "birthDate"] },
];

export const useSignup = () => {
    const { setAuthStage } = useAuth();

    const [step, setStep] = React.useState(0);
    const [loading, setLoading] = React.useState(false);

    const form = useForm<SignupSchema>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            name: "",
            birthDate: "",
        },
        disabled: loading,
        mode: "all",
        shouldFocusError: true,
    });

    const checkNextAvailability = () => {
        const validateActions = {
            0: !!Object.keys(form.formState.errors).length || !form.getValues(steps[step].fields).every(Boolean),
            1: !form.formState.isValid,
        };

        return form.formState.isSubmitting || validateActions[step as keyof typeof validateActions] || loading;
    };

    const onSubmit = React.useCallback(async (data: SignupSchema) => {
        console.log(data)
    }, []);

    const onNext = React.useCallback(async () => {
        try {
            const valid = await form.trigger(steps[step].fields, { shouldFocus: true });
            
            if (!valid) return;

            setLoading(true);

            const actions = {
                0: async () => {
                    await api.user.checkEmailBeforeSignup({ body: JSON.stringify({ email: form.getValues("email") }) })

                    setStep((prevState) => prevState + 1);
                    form.reset(form.getValues());
                },
                1: () => form.handleSubmit(onSubmit)(),
            };

            await actions[step as keyof typeof actions]();
        } catch (error) {
            console.error(error);
            isSignupFormError(error) && Object.entries(error.error).forEach(([key, value]) => form.setError(key as FieldPath<SignupSchema>, { 
                message: value.message 
            }));
        } finally {
            setLoading(false);
        }
    }, [form, onSubmit, step]);

    const onBack = React.useCallback(() => {
        setStep((prevState) => prevState - 1);
        form.reset(form.getValues());
        !step && setAuthStage("welcome");
    }, [form, setAuthStage, step]);

    return {
        form,
        step,
        loading,
        stepsLength: steps.length,
        isLastStep: step === steps.length - 1,
        isNextButtonDisabled: checkNextAvailability(),
        onNext,
        onBack,
        onSubmit,
    };
};