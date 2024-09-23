import { MessagesListContext } from './context';
import { IMessagesListContext } from './types';

export const MessagesListProvider = ({
    children,
    data
}: { children: React.ReactNode } & { data: IMessagesListContext }) => (
    <MessagesListContext.Provider value={data}>{children}</MessagesListContext.Provider>
);
