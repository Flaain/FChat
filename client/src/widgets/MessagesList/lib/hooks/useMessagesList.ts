import React from 'react';
import { IMessage } from '@/shared/model/types';
import { UseMEssagesListParams } from '../../model/types';

export const useMessagesList = ({ messages, getPreviousMessages, canFetch }: UseMEssagesListParams) => {
    const listRef = React.useRef<HTMLUListElement | null>(null);
    const lastMessageRef = React.useRef<HTMLLIElement | null>(null);

    const groupedMessages = React.useMemo(() => messages.reduce<Array<Array<IMessage>>>((acc, message) => {
        const lastGroup = acc[acc.length - 1];

        lastGroup && lastGroup[0].sender._id === message.sender._id ? lastGroup.push(message) : acc.push([message]);

        return acc;
    }, []), [messages]);

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
        lastMessageRef.current?.scrollIntoView({ behavior: 'instant' });
    }, [])

    React.useEffect(() => {
        if (!listRef.current || !lastMessageRef.current) return;

        const scrollBottom = listRef.current.scrollHeight - listRef.current.scrollTop - listRef.current.clientHeight;

        scrollBottom <= 100 && lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return { lastMessageRef, listRef, groupedMessages };
}