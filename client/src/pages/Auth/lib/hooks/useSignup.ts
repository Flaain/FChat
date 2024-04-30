import React from "react";
import { FieldPath, useForm } from "react-hook-form";
import { useAuth } from "./useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/shared/api";
import { isApiError, isFormError } from "@/shared/lib/utils/isApiError";
import { SignupSchema } from "../../model/types";
import { signupSchema } from "../../model/schema";
import { useProfile } from "@/shared/lib/hooks/useProfile";
import { useSession } from "@/entities/session/lib/hooks/useSession";
import { SessionTypes } from "@/entities/session/model/types";
import { saveDataToLocalStorage } from "@/shared/lib/utils/saveDataToLocalStorage";
import { localStorageKeys } from "@/shared/constants";
import { toast } from "sonner";

const steps: Array<{ fields: Array<FieldPath<SignupSchema>> }> = [
    { fields: ["email", "password", "confirmPassword"] },
    { fields: ["name", "birthDate"] },
];

export const useSignup = () => {
    const { setAuthStage } = useAuth();
    const { setProfile } = useProfile();
    const { dispatch } = useSession();

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
        return (
            form.formState.isSubmitting ||
            !!Object.keys(form.formState.errors).length ||
            !form.getValues(steps[step].fields).every(Boolean) ||
            loading
        );
    };

    const onSubmit = React.useCallback(async (data: SignupSchema) => {
        const {
            data: { accessToken, expiresIn, ...profile },
        } = await api.user.signup({ body: data });

        setProfile(profile);
        dispatch({
            type: SessionTypes.SET_ON_AUTH,
            payload: { isAuthorized: true, accessToken, userId: profile._id, expiresIn },
        });
        saveDataToLocalStorage({ key: localStorageKeys.TOKEN, data: accessToken });
    }, []);

    const onNext = React.useCallback(async () => {
        try {
            const isValid = await form.trigger(steps[step].fields, { shouldFocus: true });

            if (!isValid) return;

            setLoading(true);

            const actions = {
                0: async () => {
                    await api.user.checkEmailBeforeSignup({ body: { email: form.getValues("email") } });

                    setStep((prevState) => prevState + 1);
                    form.reset(form.getValues());
                },
                1: () => form.handleSubmit(onSubmit)(),
            };

            await actions[step as keyof typeof actions]();
        } catch (error) {
            console.error(error);
            isFormError<SignupSchema>(error)
                ? Object.entries(error.error).forEach(([key, { message }]) =>
                      form.setError(
                          key as FieldPath<SignupSchema>,
                          {
                              message,
                          },
                          { shouldFocus: true }
                      )
                  )
                : isApiError(error) && toast.error(error.message);
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
        rootError: form.formState.errors?.root?.serverError,
        isNextButtonDisabled: checkNextAvailability(),
        onNext,
        onBack,
        onSubmit,
    };
};