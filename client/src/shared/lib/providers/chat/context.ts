import React from 'react';
import { StoreApi, useStore } from 'zustand';
import { ChatStore } from './types';

export const ChatContext = React.createContext<StoreApi<ChatStore>>(null!);

export const useChat = <U>(selector: (state: ChatStore) => U) => {
    const store = React.useContext(ChatContext)

    if (!store) throw new Error('useChat must be used within a ChatProvider');

    return useStore(store, selector);
};