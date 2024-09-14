import { create } from 'zustand';
import { MessageStore } from './types';

export const useMessageStore = create<MessageStore>((set) => ({
    isContextActionsDisabled: false,
    setIsContextActionsDisabled: (value) => set({ isContextActionsDisabled: value })
}));