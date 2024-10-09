import React from 'react';
import { StoreApi, useStore } from 'zustand';
import { SidebarStore } from './types';

export const SidebarContext = React.createContext<StoreApi<SidebarStore>>(null!);

export const useSidebar = <U>(selector: (state: SidebarStore) => U) => {
    const store = React.useContext(SidebarContext);

    if (!store) throw new Error('useSidebar must be used within a SidebarProvider');

    return useStore(store, selector);
};