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
    handleAnchorClick: () => {},
    isRefetching: false,
    refetch: async () => {},
    listRef: { current: null },
    error: null,
    setConversation: () => {},
    showAcnhor: false,
    setShowAnchor: () => {},
    openDetails: () => {},
    closeDetails: () => {},
    showRecipientDetails: false
});