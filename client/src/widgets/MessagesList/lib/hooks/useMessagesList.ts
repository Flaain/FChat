import React from 'react';
import { IMessage } from '@/shared/model/types';
import { UseMEssagesListParams } from '../../model/types';
import { getScrollBottom } from '@/shared/lib/utils/getScrollBottom';

export const useMessagesList = ({ messages, getPreviousMessages, setShowAnchor, canFetch, listRef }: UseMEssagesListParams) => {
    const lastMessageRef = React.useRef<HTMLLIElement | null>(null);
    
    const groupedMessages = React.useMemo(() => messages.reduce<Array<Array<IMessage>>>((acc, message) => {
        const lastGroup = acc[acc.length - 1];

        lastGroup && lastGroup[0].sender._id === message.sender._id ? lastGroup.push(message) : acc.push([message]);

        return acc;
    }, []), [messages]);

    React.useEffect(() => {
        if (!listRef.current) return;

        const handleScrollContainer = () => {
            const { scrollTop } = listRef.current as HTMLUListElement;

            canFetch && !scrollTop && getPreviousMessages();

            getScrollBottom(listRef.current!) >= 300 ? setShowAnchor(true) : setShowAnchor(false);
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
        
        const scrollBottom = getScrollBottom(listRef.current!);

        scrollBottom <= 100 ? lastMessageRef.current.scrollIntoView({ behavior: 'smooth' }) : scrollBottom >= 300 && setShowAnchor(true);
    }, [messages]);

    return { lastMessageRef, listRef, groupedMessages };
}