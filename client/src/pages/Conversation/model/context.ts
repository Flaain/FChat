import React from 'react';
import { IConversationContext } from './types';

export const ConversationContext = React.createContext<IConversationContext>({
    data: null!,
    onDetails: () => {},
    getPreviousMessages: async () => {},
    isRecipientTyping: false,
    listRef: React.createRef<HTMLUListElement>(),
    lastMessageRef: React.createRef<HTMLLIElement>(),
    handleTypingStatus: () => {},
    isPreviousMessagesLoading: false,
    refetch: async () => {},
    showRecipientDetails: false,
    status: 'loading',
    isRefetching: false,
    isTyping: false,
    error: null
});

export const useConversation = () => React.useContext<IConversationContext>(ConversationContext);