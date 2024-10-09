import React from 'react';
import { createStore } from 'zustand';
import { ChatProviderProps, ChatStore } from './types';
import { ChatContext } from './context';
import { chatActions } from './actions';

export const ChatProvider = ({ children }: ChatProviderProps) => {
    const { 0: store } = React.useState(() => createStore<ChatStore>((set, get) => ({
        params: null!,
        isContextActionsBlocked: false,
        showDetails: false,
        selectedMessages: new Map(),
        mode: 'default',
        showAnchor: false,
        refs: {
            lastMessageRef: React.createRef(),
            listRef: React.createRef(),
            textareaRef: React.createRef()
        },
        actions: chatActions(set, get)
    })));

    return <ChatContext.Provider value={store}>{children}</ChatContext.Provider>;
};