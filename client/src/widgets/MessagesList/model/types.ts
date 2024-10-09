import { Message } from '@/entities/Message/model/types';

export interface MessagesListProps {
    messages: Array<Message>;
    getPreviousMessages: () => void;
    canFetch: boolean;
    isFetchingPreviousMessages: boolean;
    nextCursor: string | null;
}