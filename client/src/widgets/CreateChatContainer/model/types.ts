export type CreateChatType = 'private' | 'group' | 'choose';

export interface CreateChatContainerContextProps {
    type: CreateChatType;
    handleTypeChange: (type: CreateChatType) => void;
}