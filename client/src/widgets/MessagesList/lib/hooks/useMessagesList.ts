import React from 'react';
import { useConversationContext } from '@/pages/Conversation/lib/hooks/useConversationContext';
import { ScrollTriggeredFromTypes } from '@/pages/Conversation/model/types';

const scrollOptions: Record<Exclude<ScrollTriggeredFromTypes, 'infiniteScroll'>, ScrollIntoViewOptions> = {
    init: { behavior: 'instant' },
    send: { behavior: 'smooth' }
};

export const useMessagesList = () => {
    const { conversation: { conversation: {messages } }, info: { scrollTriggeredFromRef } } = useConversationContext();

    const lastMessageRef = React.useRef<HTMLLIElement | null>(null);

    React.useEffect(() => {
        if (!lastMessageRef.current) return;
        
        const canBeTriggered = scrollOptions[scrollTriggeredFromRef.current as keyof typeof scrollOptions];

        canBeTriggered && lastMessageRef.current.scrollIntoView(canBeTriggered);
    }, [messages]);

    return { lastMessageRef };
}