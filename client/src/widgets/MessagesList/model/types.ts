import React from 'react';
import { FeedTypes, IMessage } from '@/shared/model/types';

export interface MessagesListProps {
    messages: Array<IMessage>;
    getPreviousMessages: () => void;
    setShowAnchor: React.Dispatch<React.SetStateAction<boolean>>;
    canFetch: boolean;
    isFetchingPreviousMessages: boolean;
    nextCursor: string | null;
    type: Exclude<FeedTypes, FeedTypes.USER>;
    listRef: React.MutableRefObject<HTMLUListElement | null>;
}

export interface UseMEssagesListParams extends Pick<MessagesListProps, 'messages' | 'getPreviousMessages' | 'setShowAnchor' | 'canFetch' | 'listRef'> {}
