import { FeedTypes, IMessage } from '@/shared/model/types';

export interface MessagesListProps {
    messages: Array<IMessage>;
    getPreviousMessages: () => void;
    canFetch: boolean;
    isFetchingPreviousMessages: boolean;
    nextCursor: string | null;
    type: Exclude<FeedTypes, FeedTypes.USER>;
}

export interface UseMEssagesListParams {
    messages: Array<IMessage>;
    getPreviousMessages: () => void;
    canFetch: boolean;
}