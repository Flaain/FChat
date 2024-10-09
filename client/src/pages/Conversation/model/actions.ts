import { CONVERSATION_EVENTS, ConversationStore } from './types';
import { conversationAPI } from '../api';
import { toast } from 'sonner';
import { useSocket } from '@/shared/model/store';
import { AppException } from '@/shared/api/error';
import { redirect } from 'react-router-dom';
import { SetStateInternal } from 'zustand';

export const conversationActions = (set: SetStateInternal<ConversationStore>, get: () => ConversationStore): ConversationStore['actions'] => ({
    getConversation: async (action: 'init' | 'refetch', recipientId: string, setChatState, abortController?: AbortController) => {
        try {
            action === 'init' ? set({ status: 'loading' }) : set({ isRefetching: true });
            
            const { data } = await conversationAPI.get({ recipientId, signal: abortController?.signal });

            set({ data, status: 'idle', error: null });

            setChatState({
                params: {
                    apiUrl: '/message',
                    id: data.conversation.recipient._id,
                    query: { recipientId: data.conversation.recipient._id },
                    type: 'conversation'
                 }
            })
        } catch (error) {
            console.error(error);

            if (error instanceof AppException) {
                if (error.statusCode === 404) {
                    redirect('/');
                } else {
                    set({ error: error.message, status: 'error' });
                }
            }
        } finally {
            set({ isRefetching: false });
        }
    },
    getPreviousMessages: async () => {
        try {
            set({ isPreviousMessagesLoading: true });

            const { data: { conversation: { recipient }, nextCursor } } = get();
            const { data: previousMessages } = await conversationAPI.getPreviousMessages({
                recipientId: recipient._id,
                params: { cursor: nextCursor! }
            });

            set((prevState) => ({
                data: {
                    ...prevState.data,
                    conversation: {
                        ...prevState.data.conversation,
                        messages: [...previousMessages.messages, ...prevState.data.conversation.messages]
                    },
                    nextCursor: previousMessages.nextCursor
                }
            }));
        } catch (error) {
            console.error(error);
            toast.error('Cannot get previous messages', { position: 'top-center' });
        } finally {
            set({ isPreviousMessagesLoading: false });
        }
    },
    handleTypingStatus: () => {
        const ctx: { isTyping: boolean, typingTimeout: ReturnType<typeof setTimeout> | null } = { isTyping: false, typingTimeout: null };

        return () => {
            const { data: { conversation } } = get();
            const { socket } = useSocket.getState();
    
            const typingData = { conversationId: conversation._id, recipientId: conversation.recipient._id };

            if (!ctx.isTyping) {
                ctx.isTyping = true; 
                socket?.emit(CONVERSATION_EVENTS.START_TYPING, typingData);
            } else {
                clearTimeout(ctx.typingTimeout!);
            }
    
            ctx.typingTimeout = setTimeout(() => {
                ctx.isTyping = false;
                socket?.emit(CONVERSATION_EVENTS.STOP_TYPING, typingData);
            }, 5000);
        }
    },
});