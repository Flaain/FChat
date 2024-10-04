export interface ChatStore {
    listRef: React.RefObject<HTMLUListElement>;
    lastMessageRef: React.RefObject<HTMLLIElement>;
    params: ChatParams;
    isContextActionsBlocked: boolean;
    showAnchor: boolean;
    setChatState: (store: Partial<ChatStore>) => void;
}

export interface ChatParams {
    apiUrl: string;
    id: string;
    query: Record<string, any>;
}
