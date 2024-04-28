import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldPath, useForm } from "react-hook-form";
import { searchSchema } from "../../model/schemas";
import { CreateConversationFormType } from "../../model/types";
import { isApiError, isFormError } from "@/shared/lib/utils/isApiError";
import { toast } from "sonner";
import { api } from "@/shared/api";
import { useSession } from "@/entities/session/lib/hooks/useSession";
import { SearchUser } from "@/shared/model/types";

export const useCreateConversation = () => {
    const {
        state: { accessToken },
    } = useSession();

    const [loading, setLoading] = React.useState(false);
    const [searchedUsers, setSearchedUsers] = React.useState<Array<SearchUser>>([]);
    const [selectedUsers, setSelectedUsers] = React.useState<Map<string, string>>(new Map());

    const form = useForm({
        resolver: zodResolver(searchSchema),
        defaultValues: {
            name: "",
        },
        disabled: loading,
        mode: "all",
        shouldFocusError: true,
    });

    const isButtonDisabled = !form.formState.isValid || form.formState.isSubmitting || loading;

    const onSubmit = React.useCallback(async ({ name }: CreateConversationFormType) => {
        try {
            setLoading(true);
            
            const { data } = await api.user.search({ token: accessToken!, body: { name } });
            
            setSearchedUsers(data);
        } catch (error) {
            console.error(error);
            // setSearchedUsers([]);
            isFormError<CreateConversationFormType>(error)
                ? Object.entries(error.error).forEach(([key, { message }]) =>
                      form.setError(key as FieldPath<CreateConversationFormType>, { message }, { shouldFocus: true })
                  )
                : isApiError(error) && toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        form,
        loading,
        searchedUsers,
        isButtonDisabled,
        selectedUsers,
        setSearchedUsers,
        setSelectedUsers,
        onSubmit,
    };
};