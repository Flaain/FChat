import React from "react";
import { useLayoutContext } from "@/shared/lib/hooks/useLayoutContext";
import { getSortedFeedByLastMessage } from "@/shared/lib/utils/getSortedFeedByLastMessage";
import { ConversationFeed, DeleteMessageEventParams, FEED_EVENTS, FeedTypes, IMessage } from "@/shared/model/types";
import { UseSidebarEventsProps } from "../../model/types";

export const useSidebarEvents = ({ setLocalResults }: UseSidebarEventsProps) => {
    const { socket } = useLayoutContext();

    React.useEffect(() => {
        socket?.on(FEED_EVENTS.CREATE_CONVERSATION, (conversation: ConversationFeed) => {
            setLocalResults((prevState) => [{ ...conversation, type: FeedTypes.CONVERSATION }, ...prevState]);
        });

        socket?.on(FEED_EVENTS.CREATE_MESSAGE, ({ message, conversationId }: { message: IMessage; conversationId: string }) => {
            setLocalResults((prevState) =>
                prevState
                    .map((item) =>
                        item._id === conversationId
                            ? { ...item, lastMessage: message, lastMessageSentAt: message.createdAt }
                            : item
                    )
                    .sort(getSortedFeedByLastMessage)
            );
        });

        socket?.on(FEED_EVENTS.DELETE_MESSAGE, ({ lastMessage, lastMessageSentAt, conversationId }: DeleteMessageEventParams) => {
            setLocalResults((prevState) =>
                prevState
                    .map((item) =>
                        item._id === conversationId ? { ...item, lastMessage, lastMessageSentAt } : item
                    )
                    .sort(getSortedFeedByLastMessage)
            );
        });

        socket?.on(FEED_EVENTS.DELETE_CONVERSATION, (conversationId: string) => {
            setLocalResults((prevState) => prevState.filter((item) => item._id !== conversationId).sort(getSortedFeedByLastMessage));
        })

        return () => {
            socket?.off(FEED_EVENTS.CREATE_CONVERSATION);
            socket?.off(FEED_EVENTS.DELETE_CONVERSATION);
            
            socket?.off(FEED_EVENTS.CREATE_MESSAGE);
            socket?.off(FEED_EVENTS.DELETE_MESSAGE);
        };
    }, [socket]);
}