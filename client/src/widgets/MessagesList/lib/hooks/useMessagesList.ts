import React from 'react';
import { IMessage } from '@/shared/model/types';
import { UseMEssagesListParams } from '../../model/types';

export const useMessagesList = ({ messages, getPreviousMessages, canFetch }: UseMEssagesListParams) => {
    const listRef = React.useRef<HTMLUListElement | null>(null);
    const lastMessageRef = React.useRef<HTMLLIElement | null>(null);

    const groupedMessages = React.useMemo(() => messages.reduce((acc, message) => {
        const lastGroup = acc[acc.length - 1];

        lastGroup && lastGroup[0].sender._id === message.sender._id ? lastGroup.push(message) : acc.push([message]);

        return acc;
    }, [] as Array<Array<IMessage>>), [messages]);

    React.useEffect(() => {
        if (!listRef.current || !canFetch) return;

        const handleScrollContainer = () => {
            const { scrollTop } = listRef.current as HTMLUListElement;

            !scrollTop && getPreviousMessages();
        };

        listRef.current.addEventListener('scroll', handleScrollContainer);

        return () => {
            listRef.current?.removeEventListener('scroll', handleScrollContainer);
        };
    }, [listRef, canFetch, getPreviousMessages]);

    React.useEffect(() => {
        if (!lastMessageRef.current) return;

        lastMessageRef.current.scrollIntoView({ behavior: 'instant' });
    }, [])

    return { lastMessageRef, listRef, groupedMessages };
}