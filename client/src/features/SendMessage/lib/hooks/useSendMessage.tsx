import React from 'react';
import Confirmation from '@/shared/ui/Confirmation';
import { toast } from 'sonner';
import { api } from '@/shared/api';
import { IMessage } from '@/shared/model/types';
import { useSession } from '@/entities/session/lib/hooks/useSession';
import { useConversationContext } from '@/pages/Conversation/lib/hooks/useConversationContext';
import { useConversationContainer } from '@/widgets/ConversationContainer/lib/hooks/useConversationContainer';
import { ContainerConversationTypes, MessageFormStatus } from '@/widgets/ConversationContainer/model/types';
import { useProfile } from '@/shared/lib/hooks/useProfile';
import { useModal } from '@/shared/lib/hooks/useModal';
import { useParams } from 'react-router-dom';

export const useSendMessage = () => {
    const { profile } = useProfile();
    const { id: conversationId } = useParams() as { id: string };
    const {
        state: { accessToken, userId }
    } = useSession();
    const { openModal, closeModal, onAsyncActionCall } = useModal();
    const { conversation, setConversation } = useConversationContext();
    const {
        state: { sendMessageFormStatus, messageInputValue, selectedMessageEdit },
        dispatch
    } = useConversationContainer();

    const [isLoading, setIsLoading] = React.useState(false);

    const onKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey && 'form' in event.target) {
            event.preventDefault();
            (event.target.form as HTMLFormElement).requestSubmit();
        }
    }, []);

    const handleChange = React.useCallback(
        ({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
            dispatch({ type: ContainerConversationTypes.SET_MESSAGE_INPUT_VALUE, payload: { value } });
        },
        [dispatch]
    );
    
    const handleCloseEdit = React.useCallback(() => {
        dispatch({
            type: ContainerConversationTypes.SET_CLOSE_EDIT_FORM,
            payload: { value: '', selectedMessageEdit: null, sendMessageFormStatus: 'send' }
        });
    }, [dispatch]);

    const handleMessageDelete = React.useCallback(async () => {
        await api.message.delete({
            body: { conversationId, messageId: selectedMessageEdit!._id },
            token: accessToken!
        });

        setConversation((prev) => ({
            ...prev!,
            messages: prev!.messages.filter((message) => message._id !== selectedMessageEdit!._id)
        }));
        handleCloseEdit();
        toast.success('Message deleted', { position: 'top-center' });
    }, [conversationId, selectedMessageEdit, accessToken, setConversation, handleCloseEdit]);

    const onCloseDeleteConfirmation = () => {
        dispatch({ type: ContainerConversationTypes.SET_MESSAGE_INPUT_VALUE, payload: { value: selectedMessageEdit!.text } });
        closeModal();
    }

    const onSendEditedMessage = async () => {
        if (!messageInputValue.trim().length) {
            return openModal({
                content: (
                    <Confirmation
                        onCancel={onCloseDeleteConfirmation}
                        onConfirm={() =>
                            onAsyncActionCall({
                                asyncAction: handleMessageDelete,
                                errorMessage: 'Cannot delete message'
                            })
                        }
                        onConfirmText='Delete'
                        text='Are you sure you want to delete this message?'
                    />
                ),
                title: 'Delete message',
                size: 'fit'
            });
        }

        if (messageInputValue.trim() === selectedMessageEdit?.text) {
            return dispatch({
                type: ContainerConversationTypes.SET_CLOSE_EDIT_FORM,
                payload: { selectedMessageEdit: null, sendMessageFormStatus: 'send', value: '' }
            });
        }
    };

    const onSendMessage = async () => {
        if (!messageInputValue.trim().length) return;

        const optimisticId = window.crypto.randomUUID();

        try {
            const optimisticdMessage: IMessage = {
                _id: optimisticId,
                text: messageInputValue,
                sender: {
                    _id: userId!,
                    email: profile.email,
                    name: profile.username,
                    lastSeen: new Date().toLocaleString()
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                hasBeenEdited: false,
                hasBeenRead: false,
                sendingInProgress: true
            };

            setConversation((prev) => ({ ...prev, messages: [...prev.messages, optimisticdMessage] }));
            dispatch({ type: ContainerConversationTypes.SET_MESSAGE_INPUT_VALUE, payload: { value: '' } });

            const { data } = await api.message.send({
                token: accessToken!,
                body: { message: messageInputValue, conversationId: conversation._id }
            });

            setConversation((prev) => ({
                ...prev,
                messages: [...prev.messages, data].filter((message) => message._id !== optimisticId)
            }));
        } catch (error) {
            setConversation((prev) => ({
                ...prev,
                messages: prev.messages.filter((message) => message._id !== optimisticId)
            }));
            error instanceof Error && toast.error(error.message, { position: 'top-center' });
        }
    };

    const handleSubmitMessage = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault();

            setIsLoading(true);

            const actions: Record<MessageFormStatus, () => Promise<void>> = {
                send: onSendMessage,
                edit: onSendEditedMessage
            };

            await actions[sendMessageFormStatus]();
        } catch (error) {
            console.error(error);
            error instanceof Error && toast.error(error.message, { position: 'top-center' });
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        onKeyDown,
        handleCloseEdit,
        handleSubmitMessage,
        handleChange
    };
};