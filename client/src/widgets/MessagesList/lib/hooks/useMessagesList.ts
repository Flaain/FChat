import React from 'react';
import { useConversationContext } from '@/pages/Conversation/lib/hooks/useConversationContext';
import { useInfiniteScroll } from '@/shared/lib/hooks/useInfiniteScroll';
import { api } from '@/shared/api';
import { useSession } from '@/entities/session/lib/hooks/useSession';

export const useMessagesList = () => {
    const {
        conversation: {
            conversation: { _id, messages },
            nextCursor
        },
        setConversation,
        info: { scrollTriggeredFromRef }
    } = useConversationContext();
    const {
        state: { accessToken }
    } = useSession();

    const [isLoading, setIsLoading] = React.useState(false);

    const lastMessageRef = React.useRef<HTMLLIElement | null>(null);

    const handleScroll = async () => {
        try {
            setIsLoading(true);

            const { data } = await api.conversation.getConversation({
                body: { conversationId: _id, params: { cursor: nextCursor! } },
                token: accessToken!
            });

            scrollTriggeredFromRef.current = 'infiniteScroll';

            setConversation((prev) => ({
                ...prev,
                conversation: {
                    ...prev.conversation,
                    messages: [...data.conversation.messages, ...prev.conversation.messages]
                },
                nextCursor: data.nextCursor
            }));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const firstMessageRef = useInfiniteScroll<HTMLLIElement>({
        callback: handleScroll,
        deps: [!isLoading, nextCursor]
    });

    React.useEffect(() => {
        if (!lastMessageRef.current) return;

        lastMessageRef.current.scrollIntoView({ behavior: 'instant' });
    }, []);

    return { lastMessageRef, firstMessageRef };
};