import { create } from 'zustand';
import { SendMessageStore } from './types';
import { createRef } from 'react';

export const useSendMessage = create<SendMessageStore>((set) => ({
    showAnchor: false,
    ref: createRef<HTMLTextAreaElement>(),
    changeAnchorVisibility: (value) => set({ showAnchor: value })
}));