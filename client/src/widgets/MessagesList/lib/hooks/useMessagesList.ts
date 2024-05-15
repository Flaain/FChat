import React from 'react';
import { useConversationContext } from '@/pages/Conversation/lib/hooks/useConversationContext';
import { useInfiniteScroll } from '@/shared/lib/hooks/useInfiniteScroll';
import { api } from '@/shared/api';
import { useSession } from '@/entities/session/lib/hooks/useSession';

export const useMessagesList = () => {
    const { conversation: { conversation: { _id, messages }, meta }, setConversation, info: { scrollTriggeredFromRef } } = useConversationContext();
    const { state: { accessToken } } = useSession()

    const [isLoading, setIsLoading] = React.useState(false);

    const lastMessageRef = React.useRef<HTMLLIElement | null>(null);

    const handleScroll = async () => {
        try {
            setIsLoading(true);

            const { data } = await api.conversation.getConversation({ 
                body: { conversationId: _id, page: meta.currentPage + 1 }, 
                token: accessToken! 
            });

            scrollTriggeredFromRef.current = 'infiniteScroll';

            setConversation((prev) => ({
                ...prev,
                conversation: {
                    ...prev.conversation,
                    messages: [...data.conversation.messages, ...prev.conversation.messages]
                },
                meta: data.meta,
            }))
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const firstMessageRef = useInfiniteScroll<HTMLLIElement>({
        callback: handleScroll,
        deps: [!isLoading, meta.currentPage < meta.totalPages, messages.length < meta.totalItems]
    });

    React.useEffect(() => {
        if (!lastMessageRef.current) return;

        scrollTriggeredFromRef.current !== 'infiniteScroll' && lastMessageRef.current.scrollIntoView({ behavior: 'instant' });
    }, [messages]);

    return { lastMessageRef, firstMessageRef };
};
