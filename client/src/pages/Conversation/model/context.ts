import React from 'react';
import { ConversationContextProps } from './types';

export const ConversationContext = React.createContext<ConversationContextProps>({
    data: null!,
    status: "loading",
    isRefetching: false,
    refetch: async () => {},
    error: null,
    setConversation: () => {},
    scrollTriggeredFromRef: { current: 'init' }
});