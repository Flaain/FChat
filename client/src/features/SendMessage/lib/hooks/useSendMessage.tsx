import React from 'react';
import Confirmation from '@/shared/ui/Confirmation';
import { toast } from 'sonner';
import { api } from '@/shared/api';
import { useSession } from '@/entities/session/lib/hooks/useSession';
import { useConversationContext } from '@/pages/Conversation/lib/hooks/useConversationContext';
import { useConversationContainer } from '@/widgets/ConversationContainer/lib/hooks/useConversationContainer';
import { ContainerConversationTypes, MessageFormState } from '@/widgets/ConversationContainer/model/types';
import { useModal } from '@/shared/lib/hooks/useModal';
import { useParams } from 'react-router-dom';

export const useSendMessage = () => {
    const { id: conversationId } = useParams() as { id: string };
    const { state: { accessToken } } = useSession();
    const { openModal, closeModal, setIsAsyncActionLoading } = useModal();
    const { setConversation, info: { scrollTriggeredFromRef, filteredParticipants } } = useConversationContext();
    const { state: { formState, value, selectedMessage }, dispatch } = useConversationContainer();

    const [isLoading, setIsLoading] = React.useState(false);

    const onKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey && 'form' in event.target) {
            event.preventDefault();
            (event.target.form as HTMLFormElement).requestSubmit();
        }
    }, []);

    const handleChange = React.useCallback(({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch({ type: ContainerConversationTypes.SET_VALUE, payload: { value } });
    }, []);

    const handleCloseEdit = React.useCallback(() => {
        dispatch({ type: ContainerConversationTypes.SET_CLOSE, payload: { value: '', selectedMessage: null, formState: 'send' } });
    }, []);

    const handleMessageDelete = React.useCallback(async () => {
        try {
            setIsAsyncActionLoading(true);

            await api.message.delete({
                body: { conversationId, messageId: selectedMessage!._id },
                token: accessToken!
            });
    
            setConversation((prev) => ({
                ...prev,
                conversation: {
                    ...prev.conversation,
                    messages: prev.conversation.messages.filter((message) => message._id !== selectedMessage!._id)
                }
            }));
            
            toast.success('Message deleted', { position: 'top-center' });
        } catch (error) {
            console.error(error);
            error instanceof Error && toast.error(error.message, { position: 'top-center' });
        } finally {
            handleCloseEdit();
            setIsAsyncActionLoading(false);
        }
    }, [conversationId, selectedMessage, accessToken, setConversation, handleCloseEdit]);

    const onCloseDeleteConfirmation = () => {
        dispatch({ type: ContainerConversationTypes.SET_VALUE, payload: { value: selectedMessage!.text } });
        closeModal();
    };

    const onSendEditedMessage = async () => {
        const trimmedValue = value.trim();
        if (!trimmedValue.length) {
            return openModal({
                content: (
                    <Confirmation
                        onCancel={onCloseDeleteConfirmation}
                        onConfirm={handleMessageDelete}
                        onConfirmText='Delete'
                        text='Are you sure you want to delete this message?'
                    />
                ),
                title: 'Delete message',
                size: 'fit'
            });
        }

        if (trimmedValue === selectedMessage?.text) return handleCloseEdit();

        const { data } = await api.message.edit({
            body: { messageId: selectedMessage!._id, message: trimmedValue },
            token: accessToken!
        });

        setConversation((prevState) => ({
            ...prevState,
            conversation: {
                ...prevState.conversation,
                messages: prevState.conversation.messages.map((message) => message._id === selectedMessage!._id ? data : message)
            }
        }));
        handleCloseEdit();
    };

    const onSendMessage = async () => {
        const trimmedValue = value.trim();
        
        if (!trimmedValue.length) return;

        const { data } = await api.message.send({
            token: accessToken!,
            body: { message: trimmedValue, recipientId: filteredParticipants[0]._id }
        });

        dispatch({ type: ContainerConversationTypes.SET_VALUE, payload: { value: '' } });
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
            
            const actions: Record<MessageFormState, () => Promise<void>> = {
                send: onSendMessage,
                edit: onSendEditedMessage
            };

            await actions[formState]();
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