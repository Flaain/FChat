import React from "react";
import { useChat } from "@/shared/lib/providers/chat/context";
import { getScrollBottom } from "@/shared/lib/utils/getScrollBottom";
import { MAX_SCROLL_BOTTOM, MIN_SCROLL_BOTTOM } from "./constants";
import { MessagesListProps } from "./types";
import { Message } from "@/entities/Message/model/types";
import { useShallow } from "zustand/shallow";

export const useMessagesList = ({ getPreviousMessages, canFetch, messages }: Omit<MessagesListProps, 'nextCursor' | 'isFetchingPreviousMessages'>) => {
    const { refs: { listRef, lastMessageRef }, setChatState } = useChat(useShallow((state) => ({
        refs: state.refs,
        setChatState: state.actions.setChatState
    })))

    const groupedMessages = React.useMemo(() => messages.reduce<Array<Array<Message>>>((acc, message) => {
        const lastGroup = acc[acc.length - 1];

        lastGroup && lastGroup[0].sender._id === message.sender._id ? lastGroup.push(message) : acc.push([message]);

        return acc;
    }, []), [messages]);

    React.useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'instant' });
    }, [])

    React.useEffect(() => {
        if (!listRef.current) return;

        const handleScrollContainer = () => {
            const { scrollTop } = listRef.current as HTMLUListElement;

            canFetch && !scrollTop && getPreviousMessages();

            setChatState({ showAnchor: getScrollBottom(listRef.current!) >= MAX_SCROLL_BOTTOM });
        };

        listRef.current?.addEventListener('scroll', handleScrollContainer);

        return () => {
            listRef.current?.removeEventListener('scroll', handleScrollContainer);
        };
    }, [canFetch]);

    React.useEffect(() => {
        if (!listRef.current || !lastMessageRef.current) return;

        const scrollBottom = getScrollBottom(listRef.current!);

        scrollBottom <= MIN_SCROLL_BOTTOM ? lastMessageRef.current.scrollIntoView({ behavior: 'smooth' }) : setChatState({ showAnchor: scrollBottom >= MAX_SCROLL_BOTTOM });
    }, [messages]);

    return groupedMessages;
}