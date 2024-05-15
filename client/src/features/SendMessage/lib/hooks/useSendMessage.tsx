import React from 'react';
import Confirmation from '@/shared/ui/Confirmation';
import { toast } from 'sonner';
import { api } from '@/shared/api';
import { useSession } from '@/entities/session/lib/hooks/useSession';
import { useConversationContext } from '@/pages/Conversation/lib/hooks/useConversationContext';
import { useConversationContainer } from '@/widgets/ConversationContainer/lib/hooks/useConversationContainer';
import { ContainerConversationTypes, MessageFormStatus } from '@/widgets/ConversationContainer/model/types';
import { useModal } from '@/shared/lib/hooks/useModal';
import { useParams } from 'react-router-dom';

export const useSendMessage = () => {
    const { id: conversationId } = useParams() as { id: string };
    const {
        state: { accessToken }
    } = useSession();
    const { openModal, closeModal, onAsyncActionCall } = useModal();
    const {
        conversation,
        setConversation,
        info: { scrollTriggeredFromRef }
    } = useConversationContext();
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
            ...prev,
            conversation: {
                ...prev.conversation,
                messages: prev.conversation.messages.filter((message) => message._id !== selectedMessageEdit!._id)
            }
        }));
        handleCloseEdit();
        toast.success('Message deleted', { position: 'top-center' });
    }, [conversationId, selectedMessageEdit, accessToken, setConversation, handleCloseEdit]);

    const onCloseDeleteConfirmation = () => {
        dispatch({
            type: ContainerConversationTypes.SET_MESSAGE_INPUT_VALUE,
            payload: { value: selectedMessageEdit!.text }
        });
        closeModal();
    };

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

        if (messageInputValue.trim() === selectedMessageEdit?.text) return handleCloseEdit();

        const { data } = await api.message.edit({
            body: { messageId: selectedMessageEdit!._id, message: messageInputValue.trim() },
            token: accessToken!
        });

        setConversation((prevState) => ({
            ...prevState,
            conversation: {
                ...prevState.conversation,
                messages: prevState.conversation.messages.map((message) => message._id === selectedMessageEdit!._id ? data : message)
            }
        }));
        handleCloseEdit();
    };

    const onSendMessage = async () => {
        if (!messageInputValue.trim().length) return;

        const { data } = await api.message.send({
            token: accessToken!,
            body: { message: messageInputValue, conversationId: conversation?.conversation._id }
        });

        dispatch({ type: ContainerConversationTypes.SET_MESSAGE_INPUT_VALUE, payload: { value: '' } });
        setConversation((prev) => ({
            ...prev,
            conversation: { ...prev.conversation, messages: [...prev.conversation.messages, data] }
        }));
    };

    const handleSubmitMessage = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isLoading) return;

        try {
            setIsLoading(true);

            scrollTriggeredFromRef.current = 'send';
            
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