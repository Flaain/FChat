import React from 'react';
import { LayoutContextProps } from './types';

export const LayoutContext = React.createContext<LayoutContextProps>({
    openSheet: false,
    socket: null,
    isConnected: false,
    drafts: new Map(),
    setDrafts: () => {},
    setOpenSheet: () => {},
});