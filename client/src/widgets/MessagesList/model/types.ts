import { useSelectMessage } from '@/entities/Message';
import { Message } from '@/entities/Message/model/types';

export interface MessagesListProps {
    messages: Array<Message>;
    getPreviousMessages: () => void;
    canFetch: boolean;
    isFetchingPreviousMessages: boolean;
    nextCursor: string | null;
}

export interface IMessagesListContext extends ReturnType<typeof useSelectMessage>{
    lastMessageRef: React.RefObject<HTMLLIElement>;
    isContextActionsBlocked?: boolean;
    params: {
        id: string;
        apiUrl: string;
        query: Record<string, any>;
    }
}

export interface UseMessagesListParams extends Pick<MessagesListProps, 'messages' | 'getPreviousMessages' | 'canFetch'> {}