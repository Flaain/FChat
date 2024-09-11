import { create } from 'zustand';
import { DomEventsStore, LayoutStore } from './types';

export const useDomEvents = create<DomEventsStore>((set) => ({
    listeners: new Map(),
    addEventListener: (type, listener) => {
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

export const useLayout = create<LayoutStore>((set) => ({
    drafts: new Map(),
    isSheetOpen: false,
    onOpenSheet: () => set({ isSheetOpen: true }),
    onCloseSheet: () => set({ isSheetOpen: false }),
    setDrafts: (cb) => set((prevState) => ({ drafts: cb(prevState.drafts) })),
}));