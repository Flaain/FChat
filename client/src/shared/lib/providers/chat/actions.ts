import { SetStateInternal } from 'zustand';
import { ChatStore } from './types';

export const chatActions = (set: SetStateInternal<ChatStore>, get: () => ChatStore): ChatStore['actions'] => ({
    handleSelectMessage: (message) => {
        const { selectedMessages } = get();
        const hasMessage = selectedMessages.has(message._id);

        if (hasMessage && !(selectedMessages.size - 1)) return set({ mode: 'default', selectedMessages: new Map() });

        const newState = new Map([...selectedMessages]);

        !newState.size && set({ mode: 'selecting' });

        hasMessage ? newState.delete(message._id) : newState.set(message._id, message);

        set({ selectedMessages: newState });
    },
    setChatState: set
});