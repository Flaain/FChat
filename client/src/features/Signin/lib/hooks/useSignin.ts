import React from "react";
import { useSession } from "@/entities/session/lib/hooks/useSession";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import { useProfile } from "@/shared/lib/hooks/useProfile";
import { useForm } from "react-hook-form";
import { SigininSchemaType } from "../../model/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SessionTypes } from "@/entities/session/model/types";
import { AppException } from "@/shared/api/error";
import { signinSchema } from "../../model/schema";
import { api } from "../../api";

export const useSignin = () => {
    const { setAuthStage } = useAuth();
    const { setProfile } = useProfile();
    const { dispatch } = useSession();

    const [loading, setLoading] = React.useState(false);

    const form = useForm<SigininSchemaType>({
        resolver: zodResolver(signinSchema),
        defaultValues: {
            login: "",
            password: "",
        },
        disabled: loading,
        mode: "all",
        shouldFocusError: true,
    });

    React.useEffect(() => {
        form.setFocus('login');
    }, [])

    const onSubmit = React.useCallback(async (data: SigininSchemaType) => {
        try {
            setLoading(true);

            const { data: profile } = await api.signin(data);

            setProfile(profile);
            dispatch({ type: SessionTypes.SET_ON_AUTH, payload: { userId: profile._id } });
        } catch (error) {
            console.error(error);
            error instanceof AppException && error.toastError();
        } finally {
            setLoading(false);
        }
    }, []);

    const onBack = React.useCallback(() => {
        setAuthStage('welcome');
    }, []);

    return {
        form,
        loading,
        onSubmit,
        onBack,
        isSubmitButtonDisabled: form.formState.isSubmitting || !form.formState.isValid || loading,
    };
};