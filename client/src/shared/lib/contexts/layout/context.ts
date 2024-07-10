import React from 'react';
import { LayoutContextProps } from './types';

export const LayoutContext = React.createContext<LayoutContextProps>({
    openSheet: false,
    searchLoading: false,
    socket: null,
    isConnected: false,
    globalResults: [],
    localResults: [],
    drafts: new Map(),
    setDrafts: () => {},
    setOpenSheet: () => {},
    setLocalResults: () => {},
    searchValue: '',
    handleSearch: () => {},
    handleLogout: () => {},
    searchInputRef: null!
});