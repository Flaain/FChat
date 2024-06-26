import { useSession } from "@/entities/session/lib/hooks/useSession";
import { useConversationContext } from "./useConversationContext";
import React from "react";
import { api } from "@/shared/api";


export const usePreviousMessages = () => {
    const { data, scrollTriggeredFromRef, setConversation } = useConversationContext();
    const { state: { accessToken } } = useSession();

    const [isLoading, setIsLoading] = React.useState(false);

    const conversationContainerRef = React.useRef<HTMLDivElement | null>(null);
    
    const getPreviousMessages = async () => {
        try {
            setIsLoading(true);

            const { data: previousMessages } = await api.conversation.get({
                body: { recipientId: data?.conversation.recipient._id, params: { cursor: data?.nextCursor! } },
                token: accessToken!
            });

            scrollTriggeredFromRef.current = 'infiniteScroll';

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
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        if (!conversationContainerRef.current) return;

        const handleScrollContainer = () => {
            const { scrollTop } = conversationContainerRef.current as HTMLDivElement;

            !scrollTop && !isLoading && data?.nextCursor && getPreviousMessages();
        };

        conversationContainerRef.current.addEventListener('scroll', handleScrollContainer);

        return () => {
            conversationContainerRef.current?.removeEventListener('scroll', handleScrollContainer);
        };
    }, [data?.conversation, isLoading, getPreviousMessages, conversationContainerRef.current]);

    return { conversationContainerRef, isLoading, getPreviousMessages };
}