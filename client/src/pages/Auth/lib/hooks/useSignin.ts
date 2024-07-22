import React from "react";
import { useProfile } from "@/shared/lib/hooks/useProfile";
import { useSession } from "@/entities/session/lib/hooks/useSession";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema } from "../../model/schema";
import { SigininSchemaType } from "../../model/types";
import { api } from "@/shared/api";
import { SessionTypes } from "@/entities/session/model/types";
import { toast } from "sonner";
import { useAuth } from "./useAuth";
import { AppException } from "@/shared/api/error";

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

    const onSubmit = React.useCallback(async (data: SigininSchemaType) => {
        try {
            setLoading(true);

            const { data: profile } = await api.user.signin(data);

            setProfile(profile);
            dispatch({ type: SessionTypes.SET_ON_AUTH, payload: { isAuthorized: true, userId: profile._id } });
        } catch (error) {
            console.error(error);
            error instanceof AppException && toast.error(error.message);
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