import { IMessage } from '@/shared/model/types';
import { MessagesListProps } from '@/widgets/MessagesList/model/types';

export interface UseMessageProps {
    message: IMessage;
}

export interface MessageProps extends React.HTMLAttributes<HTMLLIElement>, Pick<MessagesListProps, 'type'> {
    message: IMessage;
    isMessageFromMe: boolean;
    isFirst: boolean;
    isLast: boolean;
}