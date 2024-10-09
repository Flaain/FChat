import React from 'react';
import { ConversationStore } from './types';
import { StoreApi, useStore } from 'zustand';

export const ConversationContext = React.createContext<StoreApi<ConversationStore>>(null!);

export const useConversation = <U>(selector: (state: ConversationStore) => U) => {
    const store = React.useContext(ConversationContext);

    if (!store) throw new Error('useConversation must be used within a ConversationProvider');

    return useStore(store, selector);
};