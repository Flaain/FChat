import React from 'react';
import { api } from '@/shared/api';
import { useNavigate, useParams } from 'react-router-dom';
import { ConversationStatuses, ConversationWithMeta } from '../../model/types';
import { Conversation, IMessage, CONVERSATION_EVENTS } from '@/shared/model/types';
import { useLayoutContext } from '@/shared/lib/hooks/useLayoutContext';
import { AppException } from '@/shared/api/error';
import { useSession } from '@/entities/session/lib/hooks/useSession';
import { SessionTypes } from '@/entities/session/model/types';

export const useConversation = () => {
    const { id: recipientId } = useParams() as { id: string };
    const { socket } = useLayoutContext();
    const { dispatch } = useSession();

    const [data, setConversation] = React.useState<ConversationWithMeta>(null!);
    const [status, setStatus] = React.useState<ConversationStatuses>('loading');
    const [error, setError] = React.useState<string | null>(null);
    const [isRefetching, setIsRefetching] = React.useState(false);
    const [isPreviousMessagesLoading, setIsPreviousMessagesLoading] = React.useState(false);

    const getPreviousMessages = async () => {
        try {
            setIsPreviousMessagesLoading(true);

            const { data: previousMessages } = await api.conversation.get({
                recipientId: data?.conversation.recipient._id, 
                params: { cursor: data?.nextCursor! }
            });

            setConversation((prev) => ({
                ...prev,
                conversation: {
                    ...prev.conversation,
                    messages: [...previousMessages.conversation.messages, ...prev.conversation.messages]
                },
                nextCursor: previousMessages.nextCursor
            }));
        } catch (error) {
            console.error(error);
        } finally {
            setIsPreviousMessagesLoading(false);
        }
    };

    const navigate = useNavigate();

    const onNewMessage = React.useCallback((message: IMessage & { conversationId: string }) => {
        setConversation((prev) => ({
            ...prev,
            conversation: { ...prev.conversation, messages: [...prev.conversation.messages, message] }
        }));
    }, []);

    const onEditMessage = React.useCallback((editedMessage: IMessage) => {
        setConversation((prev) => ({
            ...prev,
            conversation: {
                ...prev.conversation,
                messages: prev.conversation.messages.map((message) => message._id === editedMessage._id ? editedMessage : message)
            }
        }));
    }, []);

    const onCreateConversation = React.useCallback(({ _id }: Pick<Conversation, '_id' | 'lastMessageSentAt'>) => {
        setConversation((prevState) => ({ ...prevState, conversation: { ...prevState.conversation, _id } }));
    }, []);

    const onDeleteMessage = React.useCallback((messageId: string) => {
        setConversation((prev) => ({
            ...prev,
            conversation: {
                ...prev.conversation,
                messages: prev.conversation.messages.filter((message) => message._id !== messageId)
            }
        }))
    }, []);

    const getConversation = React.useCallback(async (action: 'init' | 'refetch') => {
        try {
            action === 'init' ? setStatus('loading') : setIsRefetching(true);

            const { data: response } = await api.conversation.get({ recipientId });

            setConversation(response);
            setStatus('idle');
            setError(null);
        } catch (error) {
            console.error(error);
            setStatus('error');
            
            const errorActions: Record<number, () => void> = {
                401: () => dispatch({ type: SessionTypes.SET_ON_LOGOUT }),
                404: () => navigate('/'),
            };

            if (error instanceof AppException) {
                error.statusCode in errorActions ? errorActions[error.statusCode]() : setError(error.message);
            }
        } finally {
            setIsRefetching(false);
        }
    }, [recipientId])

    React.useEffect(() => {
        getConversation('init');

        socket?.emit(CONVERSATION_EVENTS.JOIN, { recipientId });
        
        socket?.io.on('reconnect', () => {
            socket?.emit(CONVERSATION_EVENTS.JOIN, { recipientId });
            // getConversation('refetch');
        })
        socket?.on(CONVERSATION_EVENTS.MESSAGE_SEND, onNewMessage);
        socket?.on(CONVERSATION_EVENTS.MESSAGE_EDIT, onEditMessage);
        socket?.on(CONVERSATION_EVENTS.MESSAGE_DELETE, onDeleteMessage);
        socket?.on(CONVERSATION_EVENTS.CREATED, onCreateConversation);
        socket?.on(CONVERSATION_EVENTS.DELETED, () => navigate('/'));

        return () => {
            socket?.emit(CONVERSATION_EVENTS.LEAVE, { recipientId });

            socket?.off(CONVERSATION_EVENTS.MESSAGE_SEND);
            socket?.off(CONVERSATION_EVENTS.MESSAGE_EDIT);
            socket?.off(CONVERSATION_EVENTS.MESSAGE_DELETE);
            socket?.off(CONVERSATION_EVENTS.CREATED);
            socket?.off(CONVERSATION_EVENTS.DELETED);
            socket?.off('reconnect');
        };
    }, [recipientId]);

    return {
        data,
        status,
        error,
        isRefetching,
        isPreviousMessagesLoading,
        setConversation,
        getPreviousMessages,
        refetch: getConversation
    };
};