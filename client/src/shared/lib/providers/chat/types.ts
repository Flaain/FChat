import { Message } from '@/entities/Message/model/types';
import { SetStateInternal } from 'zustand';

export type ChatMode = 'default' | 'selecting';

export interface ChatStore {
    params: ChatParams;
    isContextActionsBlocked: boolean;
    showAnchor: boolean;
    mode: ChatMode;
    showDetails: boolean;
    selectedMessages: Map<string, Message>;
    refs: {
        listRef: React.RefObject<HTMLUListElement>;
        lastMessageRef: React.RefObject<HTMLLIElement>;
        textareaRef: React.RefObject<HTMLTextAreaElement>;
    };
    actions: {
        setChatState: SetStateInternal<ChatStore>;
        handleSelectMessage: (message: Message) => void;
    };
}

export interface ChatParams {
    apiUrl: string;
    id: string;
    query: Record<string, any>;
    type: 'conversation' | 'group';
}

export interface ChatProviderProps {
    readonly children: React.ReactNode;
}