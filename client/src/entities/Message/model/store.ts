import { create } from 'zustand';
import { MessageStore } from './types';

export const useMessageStore = create<MessageStore>(() => ({
    isContextActionsDisabled: false,
}));