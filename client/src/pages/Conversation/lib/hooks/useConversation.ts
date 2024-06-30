import React from 'react';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '@/shared/api';
import { useSession } from '@/entities/session/lib/hooks/useSession';
import { ConversationWithMeta, ScrollTriggeredFromTypes } from '../../model/types';
import { useSocket } from '@/shared/lib/hooks/useSocket';
import { SocketEvents } from '@/shared/lib/contexts/socket/types';
import { CONVERSATION_EVENTS } from '@/shared/lib/utils/events';
import { ConversationFeed, IMessage } from '@/shared/model/types';
import { useLayoutContext } from '@/shared/lib/hooks/useLayoutContext';
import { getIdByParticipants } from '../utils/getIdByParticipants';

export const useConversation = () => {
    const { id: recipientId } = useParams() as { id: string };
    const { state: { userId, accessToken } } = useSession();
    const { socket } = useSocket();
    const { setLocalResults } = useLayoutContext();

    const [data, setConversation] = React.useState<ConversationWithMeta>(null!);
    const [isLoading, setIsLoading] = React.useState(true);

    const scrollTriggeredFromRef = React.useRef<ScrollTriggeredFromTypes>('init');

    const navigate = useNavigate();

    const onNewMessage = React.useCallback((message: IMessage & { conversationId: string }) => {
        setConversation((prev) => ({
            ...prev,
            conversation: { ...prev.conversation, messages: [...prev.conversation.messages, message] }
        }));
        setLocalResults((prevState) => prevState
            .map((item) =>  item._id === message.conversationId ? ({ 
                ...item, 
                lastMessage: message, 
                lastMessageSentAt: message.createdAt 
            } as ConversationFeed) : item)
            .sort((a, b) => new Date(b.lastMessageSentAt).getTime() - new Date(a.lastMessageSentAt).getTime())
        );
    }, []);

    const onEditMessage = (message: IMessage & { conversationId: string }) => {
        const isLastMessage = message._id === data?.conversation.messages[data?.conversation.messages.length - 1]?._id;

        setConversation((prev) => ({
            ...prev,
            conversation: { ...prev.conversation, messages: prev.conversation.messages.map((msg) => msg._id === message._id ? message : msg) }
        }));

        isLastMessage && setLocalResults((prevState) => prevState.map((item) => item._id === message.conversationId ? ({ ...item, lastMessage: message } as ConversationFeed) : item));
    };

    React.useEffect(() => {
        const roomId = getIdByParticipants({ participants: [userId!, recipientId] });

        (async () => {
            try {
                setIsLoading(true);

                const { data } = await api.conversation.get({
                    token: accessToken!,
                    body: { recipientId }
                });

                scrollTriggeredFromRef.current = 'init';

                setConversation(data);
            } catch (error) {
                console.error(error);

                error instanceof Error && toast.error('Cannot get conversation', {
                    position: 'top-center',
                    description: error.message
                });

                navigate('/');
            } finally {
                setIsLoading(false);
            }
        })();

        socket?.emit(SocketEvents.JOIN_CONVERSATION, { recipientId });

        socket?.on(CONVERSATION_EVENTS.MESSAGE_SEND(roomId), onNewMessage);
        socket?.on(CONVERSATION_EVENTS.MESSAGE_EDIT(roomId), onEditMessage);

        return () => {
            socket?.emit(SocketEvents.LEAVE_CONVERSATION, { recipientId });

            socket?.off(CONVERSATION_EVENTS.MESSAGE_SEND(roomId));
            socket?.off(CONVERSATION_EVENTS.MESSAGE_EDIT(roomId));
        };
    }, [recipientId]);

    return {
        data,
        isLoading,
        scrollTriggeredFromRef,
        setConversation
    };
};