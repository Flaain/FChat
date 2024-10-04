import React from 'react';
import { createStore } from 'zustand';
import { ChatStore } from './types';
import { ChatContext } from './context';

const initialState: Omit<ChatStore, 'setChatState'> = {
    isContextActionsBlocked: false,
    lastMessageRef: React.createRef(),
    listRef: React.createRef(),
    params: null!,
    showAnchor: false
};

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
    const { 0: store } = React.useState(() => createStore<ChatStore>((set) => ({
        ...initialState,
        setChatState: (store) => set(store)
    })));

    return <ChatContext.Provider value={store}>{children}</ChatContext.Provider>;
};