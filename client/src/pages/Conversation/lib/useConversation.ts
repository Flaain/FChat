import React from 'react';
import { useParams } from 'react-router-dom';
import { CONVERSATION_EVENTS } from '../model/types';
import { useSocket } from '@/shared/lib/hooks/useSocket';
import { useConversationEvents } from './useConversationEvents';
import { useConversationCtx } from '../model/context';

export const useConversation = () => {
    const { socket } = useSocket();
    const { id: recipientId } = useParams<{ id: string }>();
    
    useConversationEvents();
    
    const [isTyping, setIsTyping] = React.useState(false);

    const data = useConversationCtx((state) => state.data);
    const typingTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    
    const handleTypingStatus = () => {
        const typingData = { conversationId: data.conversation._id, recipientId };

        if (!isTyping) {
            setIsTyping(true);
            
            socket?.emit(CONVERSATION_EVENTS.START_TYPING, typingData);
        } else {
            clearTimeout(typingTimeoutRef.current!);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            
            socket?.emit(CONVERSATION_EVENTS.STOP_TYPING, typingData);
        }, 5000);
    };

    return { handleTypingStatus };
};