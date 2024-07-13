import { IMessage } from '@/shared/model/types';

export interface UseMessageProps {
    message: IMessage;
}

export interface MessageProps extends React.HTMLAttributes<HTMLLIElement> {
    message: IMessage;
    isMessageFromMe: boolean;
    isFirst: boolean;
    isLast: boolean;
}