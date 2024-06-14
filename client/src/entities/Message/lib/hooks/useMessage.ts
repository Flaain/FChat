import React from 'react';
import { toast } from 'sonner';
import { api } from '@/shared/api';
import { FeedTypes, IMessage } from '@/shared/model/types';
import { useSession } from '@/entities/session/lib/hooks/useSession';
import { useConversationContext } from '@/pages/Conversation/lib/hooks/useConversationContext';
import { useConversationContainer } from '@/widgets/ConversationContainer/lib/hooks/useConversationContainer';
import { ContainerConversationTypes } from '@/widgets/ConversationContainer/model/types';
import { useModal } from '@/shared/lib/hooks/useModal';
import { useLayoutContext } from '@/shared/lib/hooks/useLayoutContext';

export const useMessage = (message: IMessage) => {
    const { dispatch } = useConversationContainer();
    const { data, setConversation } = useConversationContext();
    const { state: { accessToken } } = useSession();
    const { setLocalResults } = useLayoutContext();
    const { setIsAsyncActionLoading, closeModal } = useModal()
    const { _id, text } = message;

    const handleCopyToClipboard = React.useCallback(() => {
        navigator.clipboard.writeText(text);
        toast.success('Message copied to clipboard', { position: 'top-center' });
    }, []);

    const handleMessageDelete = React.useCallback(async () => {
        try {
            setIsAsyncActionLoading(true);

            await api.message.delete({ body: { conversationId: data?.conversation._id, messageId: _id }, token: accessToken! });

            const isLastMessage = data?.conversation.messages[data?.conversation.messages.length - 1]._id === _id;
            const filteredMessages = data?.conversation.messages.filter((message) => message._id !== _id);
            
            setConversation((prev) => ({ ...prev, conversation: { ...prev.conversation, messages: filteredMessages } }));
            
            isLastMessage && setLocalResults((prev) => prev.map((feedItem) => {
                if (feedItem.type === FeedTypes.CONVERSATION && data?.conversation._id === feedItem._id) {
                    return {
                        ...feedItem,
                        lastMessage: filteredMessages[filteredMessages.length - 1]
                    }
                }

                return feedItem;
            }))

            toast.success('Message deleted', { position: 'top-center' });
        } catch (error) {
            console.error(error);
            toast.error('Cannot delete message', { position: 'top-center' });
        } finally {
            closeModal();
            setIsAsyncActionLoading(false);
        }
    }, [data, _id]);

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