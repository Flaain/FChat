import React from "react";
import { useSession } from "@/entities/session/lib/hooks/useSession";
import { useConversationContext } from "@/pages/Conversation/lib/hooks/useConversationContext";
import { api } from "@/shared/api";

export const useScrollContainer = () => {
    const { conversation, setConversation, info } = useConversationContext();
    const { state: { accessToken } } = useSession();

    const [isLoading, setIsLoading] = React.useState(false);

    const conversationContainerRef = React.useRef<HTMLDivElement | null>(null);
    
    const getPreviousMessages = async () => {
        try {
            setIsLoading(true);

            const { data } = await api.conversation.getConversation({
                body: { conversationId: conversation.conversation._id, params: { cursor: conversation.nextCursor! } },
                token: accessToken!
            });

            info.scrollTriggeredFromRef.current = 'infiniteScroll';

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

    React.useEffect(() => {
        if (!conversationContainerRef.current) return;

        const handleScrollContainer = () => {
            const { scrollTop } = conversationContainerRef.current as HTMLDivElement;

            !scrollTop && !isLoading && conversation.nextCursor && getPreviousMessages();
        };

        conversationContainerRef.current.addEventListener('scroll', handleScrollContainer);

        return () => {
            conversationContainerRef.current?.removeEventListener('scroll', handleScrollContainer);
        };
    }, [conversation, isLoading, getPreviousMessages, conversationContainerRef.current]);

    return { conversationContainerRef, isLoading, getPreviousMessages };
}