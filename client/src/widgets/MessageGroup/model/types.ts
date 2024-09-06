import { IMessage } from '@/shared/model/types';
import { MessagesListProps } from '@/widgets/MessagesList/model/types';

export interface MessageGroupProps extends Pick<MessagesListProps, 'type'> {
    messages: Array<IMessage>;
    isLastGroup: boolean;
    lastMessageRef: React.RefObject<HTMLLIElement>;
}