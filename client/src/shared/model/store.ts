import { create } from 'zustand';
import { EventsStore, LayoutStore, SocketStore } from './types';

export const useLayout = create<LayoutStore>(() => ({
    drafts: new Map(),
    isSheetOpen: false
}));

export const useEvents = create<EventsStore>((set) => ({
    listeners: new Map(),
    addEventListener: <E extends keyof GlobalEventHandlersEventMap>(type: E, listener: (event: GlobalEventHandlersEventMap[E]) => void) => {
        set((prevState) => {
            const listeners = new Map([...prevState.listeners]);

            listeners.has(type) ? listeners.set(type, new Set([...listeners.get(type)!, listener])) : listeners.set(type, new Set([listener]));

            return { listeners };
        });

        return () => {
            set((prevState) => {
                const listeners = new Map([...prevState.listeners]);

                listeners.get(type)?.delete(listener);
                !listeners.get(type)?.size && listeners.delete(type);

                return { listeners };
            });
        };
    }
}));

export const useSocket = create<SocketStore>(() => ({
    socket: null!,
    isConnected: false,
}));