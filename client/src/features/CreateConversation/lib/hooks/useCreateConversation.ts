import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldErrors, FieldPath, useForm } from 'react-hook-form';
import { createConversationSchema } from '../../model/schemas';
import { CreateConversationFormType } from '../../model/types';
import { toast } from 'sonner';
import { api } from '@/shared/api';
import { useSession } from '@/entities/session/lib/hooks/useSession';
import { FormErrorsType } from '@/shared/model/types';
import { useModal } from '@/shared/lib/hooks/useModal';
import { useProfile } from '@/shared/lib/hooks/useProfile';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '@/shared/api/error';
import { useCreateContext } from './useCreateContext';

const MAX_CONVERSATION_SIZE = 10;

const steps: Record<number, { fields: Array<FieldPath<CreateConversationFormType>> }> = {
    0: { fields: ['username'] },
    2: { fields: ['groupName'] }
};

export const useCreateConversation = () => {
    const { state: { accessToken } } = useSession();
    const { onAsyncActionCall, closeModal } = useModal();
    const { setProfile } = useProfile();
    const { loading, step, setStep, setLoading, selectedUsers, setSearchedUsers } = useCreateContext();

    const navigate = useNavigate();

    const form = useForm<CreateConversationFormType>({
        resolver: zodResolver(createConversationSchema),
        defaultValues: {
            username: '',
            groupName: ''
        },
        disabled: loading,
        mode: 'all',
        shouldFocusError: true
    });

    const _isNextButtonDisabled = () => {
        const isFieldEmpty = !form.getValues(steps[step]?.fields).every?.(Boolean);
        const isFieldHasErrors = !!Object.entries(form.formState.errors).some(([key]) => steps[step]?.fields.includes(key as FieldPath<CreateConversationFormType>));

        const actions = {
            0: isFieldHasErrors || isFieldEmpty,
            1: !selectedUsers.size || selectedUsers.size >= MAX_CONVERSATION_SIZE,
            2: isFieldHasErrors
        };

        return actions[step as keyof typeof actions] || loading;
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onAsyncActionCall({ asyncAction: onSubmit, closeModalOnSuccess: false })
    }

    const _createConversation = React.useCallback(async ({ groupName }: Partial<Pick<CreateConversationFormType, 'groupName'>> = {}) => {
        const { data } = await api.conversation.createConversation({
            token: accessToken!,
            body: { participants: [...selectedUsers.keys()], name: groupName }
        });

        closeModal();
        setProfile((prevState) => ({ ...prevState, conversations: [...prevState.conversations, data] }));
        navigate(`/conversation/${data._id}`);
    }, [accessToken, navigate, closeModal, selectedUsers, setProfile]);

    const _displayErrorsFromAPI = React.useCallback(([key, { message }]: FormErrorsType) => {
        form.setError(key as FieldPath<CreateConversationFormType>, { message }, { shouldFocus: true });
    }, [form]);

    const onSubmit = async () => {
        try {
            setLoading(true);

            const { username, groupName } = form.getValues();

            const actions = {
                0: async () => {
                    const isValid = await form.trigger(steps[step].fields, { shouldFocus: true });

                    if (!isValid) return;

                    const { data } = await api.user.search({ token: accessToken!, body: { username } });

                    setSearchedUsers(data);
                    setStep((prevState) => prevState + 1);
                },
                1: async () => {
                    if (!selectedUsers.size || selectedUsers.size >= MAX_CONVERSATION_SIZE) throw new Error('Please select at least one user and less than 10');
                    // ^^^^ not necessary but just to be sure that we won't create group conversation with less or more 2/10 users
                    selectedUsers.size > 1 ? setStep((prevState) => prevState + 1) : await _createConversation();
                },
                2: async () => {
                    const isValid = await form.trigger(steps[step].fields, { shouldFocus: true });

                    if (!isValid) return;

                    await _createConversation({ groupName });
                }
            };

            await actions[step as keyof typeof actions]();
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                const isFormError = error instanceof ApiError && error.type === 'form';

                isFormError ? Object.entries(error.error as FieldErrors<CreateConversationFormType>).forEach(_displayErrorsFromAPI) : toast.error(error.message, {
                    position: 'top-center'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBack = React.useCallback(() => {
        setStep((prevState) => prevState - 1);
    }, [setStep]);

    return {
        form,
        isNextButtonDisabled: _isNextButtonDisabled(),
        handleBack,
        handleSubmit,
    };
};