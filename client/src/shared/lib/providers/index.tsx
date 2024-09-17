import React from 'react';
import { SocketProvider } from './socket/provider';
import { ModalProvider } from './modal';
import { useDomEvents } from '@/shared/model/store';
import { useTheme } from '@/entities/theme';

export const Providers = ({ children }: { children: React.ReactNode }) => {
    const listeners = useDomEvents((state) => state.listeners);
    const theme = useTheme((state) => state.theme);
    
    React.useLayoutEffect(() => {
        const root = window.document.documentElement;

        root.classList.add(theme);

        return () => {
            root.classList.remove('light', 'dark');
        };
    }, [theme]);

    React.useEffect(() => {
        if (!listeners.size) return;

        const entries = [...new Map([...listeners]).entries()];

        const mappedListeners = entries.map(([type, listeners]) => {
            const lastListener = [...listeners.values()]?.pop();

            if (!lastListener) return { type, listener: () => {} };

            document.addEventListener(type, lastListener);

            return { type, listener: lastListener };
        });

        return () => {
            mappedListeners.forEach(({ type, listener }) => {
                document.removeEventListener(type, listener);
            });
        };
    }, [listeners]);

    return (
        <SocketProvider>
            <ModalProvider>{children}</ModalProvider>
        </SocketProvider>
    );
};
