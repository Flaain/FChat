import React from 'react';
import { toast } from 'sonner';
import { api } from '@/shared/api';
import { IMessage } from '@/shared/model/types';
import { useConversationContext } from '@/pages/Conversation/lib/hooks/useConversationContext';
import { useModal } from '@/shared/lib/hooks/useModal';
import { useLayoutContext } from '@/shared/lib/hooks/useLayoutContext';
import { AppException } from '@/shared/api/error';
import { useSession } from '@/entities/session/lib/hooks/useSession';
import { SessionTypes } from '@/entities/session/model/types';

export const useMessage = (message: IMessage) => {
    const { _id, text } = message;
    const { data: { conversation } } = useConversationContext();
    const { setDrafts } = useLayoutContext();
    const { dispatch } = useSession(); 
    const { setIsAsyncActionLoading, closeModal } = useModal()

    const handleCopyToClipboard = React.useCallback(() => {
        navigator.clipboard.writeText(text);
        toast.success('Message copied to clipboard', { position: 'top-center' });
    }, []);

    const handleMessageDelete = React.useCallback(async () => {
        try {
            setIsAsyncActionLoading(true);

            await api.message.delete({
                messageId: _id,
                conversationId: conversation._id,
                recipientId: conversation.recipient._id
            });
            
            toast.success('Message deleted', { position: 'top-center' });
        } catch (error) {
            console.error(error);
            error instanceof AppException && error.statusCode === 401 ? dispatch({ type: SessionTypes.SET_ON_LOGOUT }) : toast.error('Cannot delete message', { 
                position: 'top-center' 
            });
        } finally {
            closeModal();
            setIsAsyncActionLoading(false);
        }
    }, [conversation, _id]);

    const handleMessageEdit = React.useCallback(async () => {
        setDrafts((prevState) => {
            const newState = new Map([...prevState]);

            newState.set(conversation.recipient._id, { value: text, state: 'edit', selectedMessage: message });

            return newState;
        })
    }, [message]);

    return {
        handleCopyToClipboard,
        handleMessageDelete,
        handleMessageEdit
    };
};