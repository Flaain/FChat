import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldPath, useForm } from "react-hook-form";
import { createConversationSchema } from "../../model/schemas";
import { CreateConversationFormType } from "../../model/types";
import { isApiError, isFormError } from "@/shared/lib/utils/isApiError";
import { toast } from "sonner";
import { api } from "@/shared/api";
import { useSession } from "@/entities/session/lib/hooks/useSession";
import { SearchUser } from "@/shared/model/types";
import { useModal } from "@/shared/lib/hooks/useModal";
import { useProfile } from "@/shared/lib/hooks/useProfile";

const MAX_CONVERSATION_SIZE = 10;

const steps: Record<number, { fields: Array<FieldPath<CreateConversationFormType>> }> = {
    0: { fields: ["username"] },
    2: { fields: ["groupName"] },
};

export const useCreateConversation = () => {
    const { state: { accessToken } } = useSession();
    const { closeModal } = useModal();
    const { setProfile } = useProfile();

    const [step, setStep] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [searchedUsers, setSearchedUsers] = React.useState<Array<SearchUser>>([]);
    const [selectedUsers, setSelectedUsers] = React.useState<Map<string, SearchUser>>(new Map());

    const form = useForm<CreateConversationFormType>({
        resolver: zodResolver(createConversationSchema),
        defaultValues: { 
            username: "", 
        },
        disabled: loading,
        mode: "all",
        shouldFocusError: true,
    });

    const _isNextButtonDisabled = () => {
        const fieldsCondition =
            !!Object.keys(form.formState.errors).length ||
            !form.getValues(steps[step]?.fields).every?.(Boolean) ||
            loading;
        const actions = {
            0: fieldsCondition,
            1: !selectedUsers.size || selectedUsers.size >= MAX_CONVERSATION_SIZE || loading,
            2: fieldsCondition || !form.formState.isValid,
        };

        return actions[step as keyof typeof actions];
    };

    const _validateStep = async () => form.trigger(steps[step].fields, { shouldFocus: true });

    const handleSelect = React.useCallback((user: SearchUser) => {
        setSelectedUsers((prevState) => {
            const newState = new Map([...prevState]);

            newState.has(user._id) ? newState.delete(user._id) : newState.set(user._id, user);

            return newState;
        });
    }, []);

    const handleRemove = React.useCallback((id: string) => {
        setSelectedUsers((prevState) => {
            const newState = new Map([...prevState]);

            newState.delete(id);

            return newState;
        });
    }, []);

    const _createConversation = async ({ groupName }: Pick<CreateConversationFormType, "groupName">) => {
        const { data } = await api.conversation.create({
            token: accessToken!,
            body: { participants: [...selectedUsers.keys()], name: groupName },
        });

        setProfile((prevState) => ({ ...prevState, conversations: [data, ...prevState.conversations] }));
        closeModal();
    };

    const onSubmit = async ({ username, groupName }: CreateConversationFormType) => {
        try {
            setLoading(true);

            const actions = {
                0: async () => {
                    if (!(await _validateStep())) return;

                    const { data } = await api.user.search({ token: accessToken!, body: { username } });

                    setSearchedUsers(data);
                    setStep((prevState) => prevState + 1);

                    form.reset(form.getValues());
                },
                1: async () => {
                    if (!selectedUsers.size || selectedUsers.size >= MAX_CONVERSATION_SIZE) throw new Error("Please select at least one user and less than 10");
                    // ^^^^ not necessary but just to be sure that we won't create group conversation with less or more 2/10 users
                    if (selectedUsers.size > 1) {
                        setStep((prevState) => prevState + 1);
                        form.reset(form.getValues());

                        return;
                    }

                    await _createConversation({ groupName });
                },
                2: async () => {
                    if (!(await _validateStep())) return;

                    await _createConversation({ groupName });
                },
            };

            await actions[step as keyof typeof actions]();
        } catch (error) {
            isFormError<CreateConversationFormType>(error)
                ? Object.entries(error.error).forEach(([key, { message }]) =>
                      form.setError(key as FieldPath<CreateConversationFormType>, { message }, { shouldFocus: true })
                  )
                : (error instanceof Error || isApiError(error)) && toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setStep((prevState) => prevState - 1);
        form.reset(form.getValues());
    };

    return {
        form,
        step,
        loading,
        searchedUsers,
        isNextButtonDisabled: _isNextButtonDisabled(),
        selectedUsers,
        setSearchedUsers,
        handleSelect,
        handleRemove,
        handleBack,
        onSubmit,
    };
};