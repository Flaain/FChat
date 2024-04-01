import React from "react";
import { z } from "zod";
import { FieldErrors, FieldPath, useForm } from "react-hook-form";
import { signupSchema } from "../../model/schema";
import { useAuth } from "./useAuth";
import { zodResolver } from "@hookform/resolvers/zod";

const steps: Array<{ fields: Array<FieldPath<z.infer<typeof signupSchema>>> }> = [
    { fields: ["email", "password", "confirmPassword", "birthDate"] },
    { fields: ["name"] },
];

export const useSignup = () => {
    const { setAuthStage } = useAuth();

    const [step, setStep] = React.useState(0);
    const [loading, setLoading] = React.useState(false);

    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: "test@test.com",
            password: "testtest",
            confirmPassword: "testtest",
            name: "",
            birthDate: "2010-01-01",
        },
        disabled: loading,
        mode: "all",
        shouldFocusError: true,
    });

    const checkNextAvailability = () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { name, ...restErrors } = form.formState.errors;

        const validateActions = {
            0: !!Object.keys(restErrors).length || !form.getValues(steps[step].fields).some(Boolean),
            1: !form.formState.isValid,
        };

        return  form.formState.isSubmitting || validateActions[step as keyof typeof validateActions] || loading
    };

    const onSubmit = React.useCallback(async (data: z.infer<typeof signupSchema>) => {
        console.log(data);
    }, []);

    const onNext = React.useCallback(async () => {
        try {
            const valid = await form.trigger(steps[step].fields);

            if (!valid) return;

            setLoading(true);
            setStep((prevState) => prevState + 1);

            // const actions = {
            //     0: async () => {
            //         const res = await new Promise((resolve, reject) => {
            //             setTimeout(() => {
            //                 resolve(1);
            //             }, 5000);
            //         });

            //         setStep((prevState) => prevState + 1);
            //     },
            //     1: () => form.handleSubmit(onSubmit)(),
            // };

            // await actions[step as keyof typeof actions]();
        } catch (error) {
            setLoading(false);
            error instanceof Error && console.error(error);
            if (!(error instanceof Error)) {
                Object.entries(error as FieldErrors<z.infer<typeof signupSchema>>).forEach(([key, value]) => {
                    form.setError(key as FieldPath<z.infer<typeof signupSchema>>, { message: value.message });
                });
            }
        } finally {
            setLoading(false);
        }
    }, [form, step]);

    const onBack = React.useCallback(() => (step ? setStep((prevState) => prevState - 1) : setAuthStage("welcome")), [setAuthStage, step]);

    return {
        form,
        step,
        stepsLength: steps.length,
        isLastStep: step === steps.length - 1,
        loading,
        onNext,
        onBack,
        onSubmit,
        isNextButtonDisabled: checkNextAvailability(),
    };
};