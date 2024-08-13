import { FeedTypes, IMessage } from '@/shared/model/types';

export interface FeedItemProps {
    _id: string;
    login: string;
    name: string;
    to: string;
    type: FeedTypes;
    draftId?: string;
    isOnline?: boolean;
    isOfficial?: boolean;
    lastMessage?: IMessage;
}