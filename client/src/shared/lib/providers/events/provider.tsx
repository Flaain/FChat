import React from 'react';
import { Listeners } from './types';
import { EventsContext } from './context';

export const EventsProvider = ({ children }: { children: React.ReactNode }) => {
    const [listeners, setListeners] = React.useState<Listeners>(new Map());

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

    const addEventListener = <E extends keyof GlobalEventHandlersEventMap>(type: E, listener: (event: GlobalEventHandlersEventMap[E]) => void) => {
        setListeners((prevState) => {
            const listeners = new Map([...prevState]);

            listeners.has(type) ? listeners.set(type, new Set([...listeners.get(type)!, listener])) : listeners.set(type, new Set([listener]));

            return listeners;
        });

        return () => {
            setListeners((prevState) => {
                const listeners = new Map([...prevState]);

                listeners.get(type)?.delete(listener);
                !listeners.get(type)?.size && listeners.delete(type);

                return listeners;
            });
        };
    };

    return <EventsContext.Provider value={{ listeners, addEventListener }}>{children}</EventsContext.Provider>;
};