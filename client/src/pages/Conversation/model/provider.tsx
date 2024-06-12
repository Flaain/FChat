import React from 'react';
import { useConversation } from '../lib/hooks/useConversation';
import { ConversationContext } from './context';

export const ConversationProvider = ({ children }: { children: React.ReactNode }) => (
    <ConversationContext.Provider value={useConversation()}>{children}</ConversationContext.Provider>
);