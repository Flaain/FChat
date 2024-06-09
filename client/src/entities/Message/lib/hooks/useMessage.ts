import React from 'react';
import { toast } from 'sonner';
import { api } from '@/shared/api';
import { useParams } from 'react-router-dom';
import { IMessage } from '@/shared/model/types';
import { useSession } from '@/entities/session/lib/hooks/useSession';
import { useConversationContext } from '@/pages/Conversation/lib/hooks/useConversationContext';
import { useConversationContainer } from '@/widgets/ConversationContainer/lib/hooks/useConversationContainer';
import { ContainerConversationTypes } from '@/widgets/ConversationContainer/model/types';
import { useModal } from '@/shared/lib/hooks/useModal';

export const useMessage = (message: IMessage) => {
    const { dispatch } = useConversationContainer();
    const { setConversation } = useConversationContext();
    const { state: { accessToken } } = useSession();
    const { setIsAsyncActionLoading, closeModal } = useModal()
    const { id: conversationId } = useParams() as { id: string };
    const { _id, text } = message;

    const handleCopyToClipboard = React.useCallback(() => {
        navigator.clipboard.writeText(text);
        toast.success('Message copied to clipboard', { position: 'top-center' });
    }, []);

    const handleMessageDelete = React.useCallback(async () => {
        try {
            setIsAsyncActionLoading(true);

            await api.message.delete({ body: { conversationId, messageId: _id }, token: accessToken! });

            setConversation((prev) => ({
                ...prev,
                conversation: {
                    ...prev.conversation,
                    messages: prev.conversation.messages.filter((message) => message._id !== _id)
                }
            }));
            toast.success('Message deleted', { position: 'top-center' });
        } catch (error) {
            console.error(error);
            toast.error('Cannot delete message', { position: 'top-center' });
        } finally {
            closeModal();
            setIsAsyncActionLoading(false);
        }
    }, [conversationId, _id]);

    const handleMessageEdit = React.useCallback(async () => {
        dispatch({
            type: ContainerConversationTypes.SET_SELECTED_MESSAGE,
            payload: { message, formState: 'edit' }
        });
    }, [dispatch, message]);

    return {
        handleCopyToClipboard,
        handleMessageDelete,
        handleMessageEdit
    };
};