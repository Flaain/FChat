import React from "react";
import { useForm } from "react-hook-form";
import { SigininSchemaType } from "../model/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppException } from "@/shared/api/error";
import { signinSchema } from "../model/schema";
import { api } from "../api";
import { toast } from "sonner";
import { useProfile } from "@/entities/profile";
import { useSession } from "@/entities/session/model/store";

export const useSignin = () => {
    const [loading, setLoading] = React.useState(false);
    
    const onSignin = useSession((state) => state.actions.onSignin);
    
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

            useProfile.setState({ profile });
            
            onSignin(profile._id);
        } catch (error) {
            console.error(error);
            error instanceof AppException ? error.toastError() : toast.error('Cannot signin. Please try again later', { position: 'top-center' });
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        form,
        loading,
        onSubmit,
        isSubmitButtonDisabled: form.formState.isSubmitting || !form.formState.isValid || loading,
    };
};