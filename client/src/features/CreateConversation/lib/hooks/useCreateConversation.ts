import React from 'react';
import { FieldErrors, FieldPath, useForm } from 'react-hook-form';
import { CreateConversationType } from '../../model/types';
import { debounce } from '@/shared/lib/utils/debounce';
import { useModal } from '@/shared/lib/hooks/useModal';
import { FormErrorsType, SearchUser } from '@/shared/model/types';
import { api } from '@/shared/api';
import { useSession } from '@/entities/session/lib/hooks/useSession';
import { ApiError } from '@/shared/api/error';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { createConversationSchema } from '../../model/schemas';

export const useCreateConversation = () => {
    const [searchedUsers, setSearchedUsers] = React.useState<Array<SearchUser>>([]);
    const [selectedUser, setSelectedUser] = React.useState<SearchUser | null>(null);

    const { state: { accessToken } } = useSession()
    const { isAsyncActionLoading, setIsAsyncActionLoading, onAsyncActionCall } = useModal();
    
    const form = useForm<CreateConversationType>({
        resolver: zodResolver(createConversationSchema),
        defaultValues: {
            username: ''
        },
        disabled: isAsyncActionLoading,
        mode: 'all',
        shouldFocusError: true
    });

    const isSubmitButtonDisabled = !form.formState.isValid || !selectedUser || isAsyncActionLoading;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (!form.trigger() || !selectedUser) return;
        
        onAsyncActionCall({
            asyncAction: onSubmit,
            errorMessage: 'Failed to create conversation',
        })
    }

    const displayErrorsFromAPI = ([key, { message }]: FormErrorsType) => {
        form.setError(key as FieldPath<CreateConversationType>, { message }, { shouldFocus: true });
    };
    
    const onSubmit = async () => {
        try {
        } catch (error) {
            
        }
    }

    const handleSearchUser = React.useCallback(({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        const trimmedValue = value.trim();

        if (!value || !trimmedValue.length) {
            setSearchedUsers([]);
            setSelectedUser(null);
            return;
        };

        trimmedValue.length > 2 && handleSearchDelay(trimmedValue)
    }, []);

    const handleSearchDelay = React.useCallback(debounce(async (value: string) => {
        try {
            setIsAsyncActionLoading(true);

            const { data } = await api.user.search({ body: { username: value }, token: accessToken! });

            setSearchedUsers(data);
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                const isFormError = error instanceof ApiError && error.type === 'form';

                isFormError ? Object.entries(error.error as FieldErrors<CreateConversationType>).forEach(displayErrorsFromAPI) : toast.error(error.message, {
                    position: 'top-center'
                });
            }
        } finally {
            setIsAsyncActionLoading(false);
        }
    }, 500), []);

    return {
        form,
        isSubmitButtonDisabled,
        searchedUsers,
        selectedUser,
        handleSearchUser,
        handleSubmit,
        setSelectedUser
    }
}
