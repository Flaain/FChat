import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import { ConversationStore } from "./types";
import { toast } from "sonner";
import { conversationAPI } from "../api";
import { AppException } from "@/shared/api/error";
import { redirect } from "react-router-dom";
import { useMessageStore } from "@/entities/Message/model/store";

export const useConversationStore = createWithEqualityFn<ConversationStore>((set, get) => ({
    data: null!,
    showRecipientDetails: false,
    isPreviousMessagesLoading: false,
    status: 'loading',
    getConversation: async (action: 'init' | 'refetch') => {
        try {
            const { abortController } = get();
            const { pathname } = new URL(window.location.href);

            abortController.current?.abort('Signal aborted due to new incoming request');
            abortController.current = new AbortController();

            action === 'init' ? set({ status: 'loading' }) : set({ isRefetching: true });

            const { data } = await conversationAPI.get({ recipientId: pathname.split('/').pop()!, signal: abortController.current.signal });
            
            useMessageStore.setState({ isContextActionsDisabled: data.conversation.isInitiatorBlocked || data.conversation.isRecipientBlocked });
            
            set({ data, status: 'idle', error: null });
        } catch (error) {
            console.error(error);
            
            if (error instanceof AppException) {
                error.statusCode === 404 ? redirect('/') : set({ status: 'error', error: error.message });
            }
        } finally {
            set({ isRefetching: false });
        }
    },
    refetch: () => get().getConversation('refetch'),
    setIsRecipientTyping: (value) => set({ isRecipientTyping: value }),
    isRecipientTyping: false,
    isRefetching: false,
    abortController: { current: null },
    openDetails: () => set({ showRecipientDetails: true }),
    closeDetails: () => set({ showRecipientDetails: false }),
    error: null,
    setConversation: (cb) => set((prevState) => ({ ...prevState, data: cb(prevState.data) })),
    getPreviousMessages: async () => {
        try {
            set({ isPreviousMessagesLoading: true });
            
            const { data, setConversation } = get(); 
            const { data: previousMessages } = await conversationAPI.getPreviousMessages({ 
                recipientId: data.conversation.recipient._id,
                params: { cursor: data.nextCursor! } 
            })

            setConversation((prev) => ({
                ...prev,
                conversation: {
                    ...prev.conversation,
                    messages: [...previousMessages.messages, ...prev.conversation.messages]
                },
                nextCursor: previousMessages.nextCursor
            }));
        } catch (error) {
            console.error(error);
            toast.error('Cannot get previous messages', { position: 'top-center' });
        } finally {
            set({ isPreviousMessagesLoading: false });
        }
    },
    destroy: () => set({}, true),
}), shallow)