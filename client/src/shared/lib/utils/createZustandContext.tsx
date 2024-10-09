import React from 'react';
import { StoreApi, useStore } from 'zustand';

export const createZustandContext = <S, TInitial extends Partial<S> | undefined = undefined>(getStore: (initial?: TInitial) => StoreApi<S>) => {
    const Context = React.createContext<StoreApi<S> | null>(null);
    
    const Provider = (props: { children?: React.ReactNode; initialValue?: TInitial }) => {
        const { 0: store } = React.useState(getStore(props.initialValue));

        return <Context.Provider value={store}>{props.children}</Context.Provider>;
    };

    const useContext = <U,>(selector: (state: S) => U) => {
        const store = React.useContext(Context);

        if (!store) {
            throw new Error('useStore must be used within a StoreProvider');
        }

        return useStore(store, selector);
    }

    return {
        Context,
        Provider,
        useContext
    };
};