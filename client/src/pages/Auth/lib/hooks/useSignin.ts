import React from "react";
import { useProfile } from "@/shared/lib/hooks/useProfile";
import { useSession } from "@/entities/session/lib/hooks/useSession";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema } from "../../model/schema";
import { SigininSchema } from "../../model/types";
import { isApiError } from "@/shared/lib/utils/isApiError";
import { api } from "@/shared/api";
import { SessionTypes } from "@/entities/session/model/types";
import { toast } from "sonner";
import { useAuth } from "./useAuth";
import { saveDataToLocalStorage } from "@/shared/lib/utils/saveDataToLocalStorage";
import { localStorageKeys } from "@/shared/constants";

export const useSignin = () => {
    const { setAuthStage } = useAuth();
    const { setProfile } = useProfile();
    const { dispatch } = useSession();

    const [loading, setLoading] = React.useState(false);

    const form = useForm<SigininSchema>({
        resolver: zodResolver(signinSchema),
        defaultValues: {
            email: "",
            password: "",
        },
        disabled: loading,
        mode: "all",
        shouldFocusError: true,
    });

    const onSubmit = React.useCallback(async (data: SigininSchema) => {
        try {
            setLoading(true);

            const { data: { accessToken, expiresIn, ...profile } } = await api.user.signin({ body: data });

            setProfile(profile);
            dispatch({
                type: SessionTypes.SET_ON_AUTH,
                payload: { accessToken, expiresIn, isAuthorized: true, userId: profile._id },
            });

            saveDataToLocalStorage({ key: localStorageKeys.TOKEN, data: accessToken })
        } catch (error) {
            console.error(error);
            isApiError(error) && toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const onBack = React.useCallback(() => {
        setAuthStage("welcome");
    }, []);

    return {
        form,
        loading,
        onSubmit,
        onBack,
        isSubmitButtonDisabled: form.formState.isSubmitting || !form.formState.isValid || loading,
    };
};