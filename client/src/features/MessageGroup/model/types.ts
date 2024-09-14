import { Message } from '@/entities/Message/model/types';

export interface MessageGroupProps {
    messages: Array<Message>;
    isLastGroup: boolean;
    lastMessageRef: React.RefObject<HTMLLIElement>;
    isContextActionsBlocked?: boolean;
}