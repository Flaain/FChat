import { create } from 'zustand';
import { MessagesListStore } from './types';
import { createRef } from 'react';

export const useMessagesListStore = create<MessagesListStore>((set) => ({
    ref: createRef<HTMLUListElement>()
}));