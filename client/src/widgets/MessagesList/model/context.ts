import React from 'react';
import { IMessagesListContext } from './types';

export const MessagesListContext = React.createContext<IMessagesListContext>({
    lastMessageRef: React.createRef<HTMLLIElement>(),
    isContextActionsBlocked: false,
    params: null!,
    handleSelectMessage: () => {},
    isSelecting: false,
    selectedMessages: new Map()
});

export const useMessagesList = () => React.useContext(MessagesListContext);