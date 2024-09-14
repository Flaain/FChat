import { Message } from '@/entities/Message/model/types';

export interface MessagesListProps {
    messages: Array<Message>;
    getPreviousMessages: () => void;
    canFetch: boolean;
    isContextActionsBlocked?: boolean;
    isFetchingPreviousMessages: boolean;
    nextCursor: string | null;
}

export interface UseMessagesListParams extends Pick<MessagesListProps, 'messages' | 'getPreviousMessages' | 'canFetch'> {}

export interface MessagesListStore {
    ref: React.RefObject<HTMLUListElement>;
}