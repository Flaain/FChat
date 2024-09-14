import React from 'react';
import { getScrollBottom } from '@/shared/lib/utils/getScrollBottom';
import { UseMessagesListParams } from '../model/types';
import { Message } from '@/entities/Message/model/types';
import { useMessagesListStore } from '../model/store';
import { useSendMessageStore } from '@/features/SendMessage/model/store';

const MAX_SCROLL_BOTTOM = 300;
const MIN_SCROLL_BOTTOM = 100;

export const useMessagesList = ({ messages, getPreviousMessages, canFetch }: UseMessagesListParams) => {
    const { ref } = useMessagesListStore();
    const { changeAnchorVisibility } = useSendMessageStore();

    const lastMessageRef = React.useRef<HTMLLIElement | null>(null);
    
    const groupedMessages = React.useMemo(() => messages.reduce<Array<Array<Message>>>((acc, message) => {
        const lastGroup = acc[acc.length - 1];

        lastGroup && lastGroup[0].sender._id === message.sender._id ? lastGroup.push(message) : acc.push([message]);

        return acc;
    }, []), [messages]);

    React.useEffect(() => {
        if (!ref.current) return;

        const handleScrollContainer = () => {
            const { scrollTop } = ref.current as HTMLUListElement;

            canFetch && !scrollTop && getPreviousMessages();

            changeAnchorVisibility(getScrollBottom(ref.current!) >= MAX_SCROLL_BOTTOM);
        };

        ref.current.addEventListener('scroll', handleScrollContainer);

        return () => {
            ref.current?.removeEventListener('scroll', handleScrollContainer);
        };
    }, [ref, canFetch, getPreviousMessages]);

    React.useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'instant' });
    }, [])

    React.useEffect(() => {
        if (!ref.current || !lastMessageRef.current) return;
        
        const scrollBottom = getScrollBottom(ref.current!);

        scrollBottom <= MIN_SCROLL_BOTTOM
            ? lastMessageRef.current.scrollIntoView({ behavior: 'smooth' })
            : scrollBottom >= MAX_SCROLL_BOTTOM && changeAnchorVisibility(true);
    }, [messages]);

    return { lastMessageRef, groupedMessages, ref };
}