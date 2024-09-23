import React from 'react';
import { IMessagesListContext } from './types';

export const MessagesListContext = React.createContext<IMessagesListContext>({
    lastMessageRef: React.createRef<HTMLLIElement>(),
    isContextActionsBlocked: false,
    params: null!
});

export const useMessagesList = () => React.useContext(MessagesListContext);