import React from 'react';
import { FieldErrors, FieldPath, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { api } from '@/shared/api';
import { useSession } from '@/entities/session/lib/hooks/useSession';
import { FormErrorsType } from '@/shared/model/types';
import { useModal } from '@/shared/lib/hooks/useModal';
import { useProfile } from '@/shared/lib/hooks/useProfile';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '@/shared/api/error';
import { CreateGroupType } from '../../model/types';
import { useCreateGroupContext } from './useCreateGroupContext';
import { debounce } from '@/shared/lib/utils/debounce';
import { useCreateChatContainer } from '@/widgets/CreateChatContainer/lib/hooks/useCreateChatContainer';
import { zodResolver } from '@hookform/resolvers/zod';
import { createGroupSchema } from '../../model/schemas';

const steps: Record<number, { fields: Array<FieldPath<CreateGroupType>> }> = {
    0: { fields: ['displayName'] },
    1: { fields: ['username'] },
    2: { fields: ['groupName'] }
};

export const useCreateGroup = () => {
    const { setProfile } = useProfile();
    const { state: { accessToken } } = useSession();
    const { handleTypeChange } = useCreateChatContainer();
    const { setIsAsyncActionLoading, isAsyncActionLoading, onAsyncActionCall, closeModal } = useModal();
    const { step, setStep, selectedUsers, setSearchedUsers } = useCreateGroupContext();

    const form = useForm<CreateGroupType>({
        resolver: zodResolver(createGroupSchema),
        defaultValues: {
            displayName: '',
            username: '',
            groupName: ''
        },
        disabled: isAsyncActionLoading,
        mode: 'all',
        shouldFocusError: true
    });

    const navigate = useNavigate();
    
    const _isNextButtonDisabled = () => {
        const isFieldEmpty = !form.getValues(steps[step]?.fields).every?.(Boolean);
        const isFieldHasErrors = !!Object.entries(form.formState.errors).some(([key]) => steps[step]?.fields.includes(key as FieldPath<CreateGroupType>));
        const fieldErrors = isFieldEmpty || isFieldHasErrors;

        const actions = {
            0: fieldErrors,
            1: selectedUsers.size >= 10,
            2: fieldErrors
        }

        return actions[step as keyof typeof actions] || isAsyncActionLoading;
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit();
    }

    const handleSearchDelay = React.useCallback(debounce(async (value: string) => {
        try {
            setIsAsyncActionLoading(true);

            const { data } = await api.user.search({ body: { username: value }, token: accessToken! });

            setSearchedUsers(data);
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                const isFormError = error instanceof ApiError && error.type === 'form';

                isFormError ? Object.entries(error.error as FieldErrors<CreateGroupType>).forEach(_displayErrorsFromAPI) : toast.error(error.message, {
                    position: 'top-center'
                });
            }
        } finally {
            setIsAsyncActionLoading(false);
        }
    }, 500), []);

    const createGroup = React.useCallback(async () => {
        // const { data } = await api.conversation.createConversation({
        //     token: accessToken!,
        //     body: { participants: [...selectedUsers.keys()], name: groupName }
        // });

        // closeModal();
        // setProfile((prevState) => ({ ...prevState, conversations: [...prevState.conversations, data] }));
        // navigate(`/group/${data._id}`);

        const { displayName, groupName } = form.getValues();

        console.log(selectedUsers, displayName, groupName);
    }, [accessToken, navigate, closeModal, selectedUsers, setProfile]);

    const _displayErrorsFromAPI = React.useCallback(([key, { message }]: FormErrorsType) => {
        form.setError(key as FieldPath<CreateGroupType>, { message }, { shouldFocus: true });
    }, [form]);

    const handleSearchUser = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        if (!value || !value.trim().length) return setSearchedUsers([]);

        handleSearchDelay(value)
    }

    const onSubmit = async () => {
        try {
            const actions = {
                0: async () => {
                    if (!await form.trigger(steps[step].fields, { shouldFocus: true })) return;
                    
                    setStep((prevState) => prevState + 1);
                },
                1: () => setStep((prevState) => prevState + 1),
                2: async () => onAsyncActionCall({ asyncAction: createGroup, errorMessage: 'Failed to create group' })
            };

            await actions[step as keyof typeof actions]();
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                const isFormError = error instanceof ApiError && error.type === 'form';

                isFormError ? Object.entries(error.error as FieldErrors<CreateGroupType>).forEach(_displayErrorsFromAPI) : toast.error(error.message, {
                    position: 'top-center'
                });
            }
        }
    };

    const handleBack = React.useCallback(() => {
        if (!step) return handleTypeChange('choose');

        setStep((prevState) => prevState - 1);
    }, [setStep, step]);

    return {
        form,
        isNextButtonDisabled: _isNextButtonDisabled(),
        handleBack,
        handleSubmit,
        handleSearchUser
    };
};