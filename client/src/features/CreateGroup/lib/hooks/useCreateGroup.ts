import React from 'react';
import { FieldPath, useForm } from 'react-hook-form';
import { api } from '@/shared/api';
import { SearchUser } from '@/shared/model/types';
import { useModal } from '@/shared/lib/hooks/useModal';
import { useProfile } from '@/shared/lib/hooks/useProfile';
import { useNavigate } from 'react-router-dom';
import { CreateGroupType } from '../../model/types';
import { debounce } from '@/shared/lib/utils/debounce';
import { zodResolver } from '@hookform/resolvers/zod';
import { createGroupSchema } from '../../model/schemas';
import { useSession } from '@/entities/session/lib/hooks/useSession';
import { AppException } from '@/shared/api/error';
import { SessionTypes } from '@/entities/session/model/types';

const steps: Record<number, { fields: Array<FieldPath<CreateGroupType>> }> = {
    0: { fields: ['displayName'] },
    1: { fields: ['username'] },
    2: { fields: ['groupName'] }
};

export const useCreateGroup = () => {
    const { setProfile } = useProfile();
    const { dispatch } = useSession();
    const { setIsAsyncActionLoading, isAsyncActionLoading, closeModal } = useModal();

    const [step, setStep] = React.useState(0);
    const [searchedUsers, setSearchedUsers] = React.useState<Array<SearchUser>>([]);
    const [selectedUsers, setSelectedUsers] = React.useState<Map<string, SearchUser>>(new Map());

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

            const { data } = await api.user.search({ query: value });

            setSearchedUsers(data);
        } catch (error) {
            console.error(error);
            error instanceof AppException && error.statusCode === 401 && dispatch({ 
                type: SessionTypes.SET_ON_LOGOUT 
            });
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
    }, [navigate, closeModal, selectedUsers, setProfile]);

    const handleSearchUser = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        const trimmedValue = value.trim();

        if (!value || !trimmedValue.length) return setSearchedUsers([]);

       trimmedValue.length > 2 && handleSearchDelay(trimmedValue)
    }

    const onSubmit = async () => {
        try {
            const actions = {
                0: async () => {
                    if (!await form.trigger(steps[step].fields, { shouldFocus: true })) return;
                    
                    setStep((prevState) => prevState + 1);
                },
                1: () => setStep((prevState) => prevState + 1),
                2: createGroup
            };

            await actions[step as keyof typeof actions]();
        } catch (error) {
            console.error(error);
        }
    };

    const handleBack = React.useCallback(() => {
        if (!step) return closeModal();
        setStep((prevState) => prevState - 1);
    }, [setStep, step]);

    return {
        form,
        step,
        searchedUsers,
        selectedUsers,
        isNextButtonDisabled: _isNextButtonDisabled(),
        handleBack,
        handleSelect,
        handleRemove,
        handleSubmit,
        handleSearchUser
    };
};