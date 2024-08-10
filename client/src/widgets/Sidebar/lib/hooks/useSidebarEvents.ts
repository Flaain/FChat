import React from "react";
import { useLayoutContext } from "@/shared/lib/hooks/useLayoutContext";
import { getSortedFeedByLastMessage } from "@/shared/lib/utils/getSortedFeedByLastMessage";
import { ConversationFeed, DeleteMessageEventParams, FEED_EVENTS, FeedTypes, IMessage, PRESENCE } from "@/shared/model/types";
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

        socket?.on(FEED_EVENTS.EDIT_MESSAGE, ({ message, conversationId }: { message: IMessage; conversationId: string }) => {
            setLocalResults((prevState) =>
                prevState
                    .map((item) =>
                        item._id === conversationId
                            ? { ...item, lastMessage: message, lastMessageSentAt: message.createdAt }
                            : item
                    )
                    .sort(getSortedFeedByLastMessage)
            );
        })

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
        
        socket?.on(FEED_EVENTS.USER_ONLINE, (recipientId: string) => {
            setLocalResults((prevState) => prevState.map((item) => {
                if (FeedTypes.CONVERSATION === item.type && item.recipient._id === recipientId) {
                    return {
                        ...item,
                        recipient: {
                            ...item.recipient,
                            presence: PRESENCE.ONLINE,
                        }
                    }
                }
                
                return item;
            }));
        })

        socket?.on(FEED_EVENTS.USER_OFFLINE, (recipientId: string) => {
            setLocalResults((prevState) => prevState.map((item) => {
                if (FeedTypes.CONVERSATION === item.type && item.recipient._id === recipientId) {
                    return {
                        ...item,
                        recipient: {
                            ...item.recipient,
                            presence: PRESENCE.OFFLINE,
                        }
                    }
                }

                return item;
            }));
        })

        return () => {
            socket?.off(FEED_EVENTS.USER_ONLINE);
            socket?.off(FEED_EVENTS.USER_OFFLINE);
            
            socket?.off(FEED_EVENTS.CREATE_CONVERSATION);
            socket?.off(FEED_EVENTS.DELETE_CONVERSATION);
            
            socket?.off(FEED_EVENTS.CREATE_MESSAGE);
            socket?.off(FEED_EVENTS.DELETE_MESSAGE);
        };
    }, [socket]);
}