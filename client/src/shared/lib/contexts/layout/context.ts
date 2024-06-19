import React from 'react';
import { LayoutContextProps } from './types';

export const LayoutContext = React.createContext<LayoutContextProps>({
    openSheet: false,
    searchLoading: false,
    globalResults: [],
    localResults: [],
    conversationDrafts: new Map(),
    setConversationDrafts: () => {},
    setOpenSheet: () => {},
    setLocalResults: () => {},
    searchValue: '',
    handleSearch: () => {},
    handleLogout: () => {},
    searchInputRef: null!
});