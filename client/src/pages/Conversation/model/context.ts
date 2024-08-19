import React from 'react';
import { ConversationContextProps } from './types';

export const ConversationContext = React.createContext<ConversationContextProps>({
    data: null!,
    status: "loading",
    isPreviousMessagesLoading: false,
    getPreviousMessages: async () => {},
    isRefetching: false,
    refetch: async () => {},
    error: null,
    setConversation: () => {},
    setShowRecipientDetails: () => {},
    showRecipientDetails: false
});