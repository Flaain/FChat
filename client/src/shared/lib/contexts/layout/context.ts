import React from 'react';
import { LayoutContextProps } from './types';

export const LayoutContext = React.createContext<LayoutContextProps>({
    openSheet: false,
    searchLoading: false,
    feed: [],
    setOpenSheet: () => {},
    searchValue: '',
    handleSearch: () => {},
    handleLogout: () => {},
    searchInputRef: null!
});