import React from 'react';
import { ConversationContextProps } from './types';

export const ConversationContext = React.createContext<ConversationContextProps>({
    data: null!,
    status: "loading",
    isPreviousMessagesLoading: false,
    isRecipientTyping: false,
    handleTypingStatus: () => {},
    getPreviousMessages: async () => {},
    getConversationDescription: () => '',
    isRefetching: false,
    refetch: async () => {},
    error: null,
    setConversation: () => {},
    openDetails: () => {},
    closeDetails: () => {},
    showRecipientDetails: false
});