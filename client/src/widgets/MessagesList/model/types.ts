import { Message } from '@/entities/Message/model/types';

export interface MessagesListProps {
    messages: Array<Message>;
    getPreviousMessages: () => void;
    canFetch: boolean;
    isFetchingPreviousMessages: boolean;
    nextCursor: string | null;
    listRef: React.RefObject<HTMLUListElement>;
    lastMessageRef: React.RefObject<HTMLLIElement>;
}

export interface UseMessagesListParams extends Pick<MessagesListProps, 'messages' | 'getPreviousMessages' | 'canFetch'> {}