import React from "react";
import { useLayoutContext } from "@/shared/lib/hooks/useLayoutContext";
import { getSortedFeedByLastMessage } from "@/shared/lib/utils/getSortedFeedByLastMessage";
import { ConversationFeed, DeleteMessageEventParams, FEED_EVENTS, FeedTypes, GroupFeed, IMessage, PRESENCE, TypingParticipant } from "@/shared/model/types";
import { UseSidebarEventsProps } from "../../model/types";

export const useSidebarEvents = ({ setLocalResults }: UseSidebarEventsProps) => {
    const { socket } = useLayoutContext();
    
    const updateFeed = React.useCallback((update: Pick<ConversationFeed | GroupFeed, 'lastMessage' | 'lastActionAt'>, id: string, sort?: boolean) => {
        setLocalResults((prevState) => {
            const updatedArray = prevState.map((item) => item._id === id ? { ...item, ...update } : item);

            return sort ? updatedArray.sort(getSortedFeedByLastMessage) : updatedArray;
        });
    }, [])

    React.useEffect(() => {
        socket?.on(FEED_EVENTS.CREATE_CONVERSATION, (conversation: ConversationFeed) => {
            setLocalResults((prevState) => [{ ...conversation, type: FeedTypes.CONVERSATION }, ...prevState]);
        });

        socket?.on(FEED_EVENTS.CREATE_MESSAGE, ({ message, id }: { message: IMessage; id: string }) => {
            updateFeed({ lastMessage: message, lastActionAt: message.createdAt }, id, true);
        });

        socket?.on(FEED_EVENTS.EDIT_MESSAGE, ({ message, id }: { message: IMessage; id: string }) => {
            updateFeed({ lastMessage: message, lastActionAt: message.createdAt }, id);
        })

        socket?.on(FEED_EVENTS.DELETE_MESSAGE, ({ lastMessage, lastMessageSentAt, id }: DeleteMessageEventParams) => {
            updateFeed({ lastMessage, lastActionAt: lastMessageSentAt }, id, true);
        });

        socket?.on(FEED_EVENTS.DELETE_CONVERSATION, (id: string) => {
            setLocalResults((prevState) => prevState.filter((item) => item._id !== id).sort(getSortedFeedByLastMessage));
        })
        
        socket?.on(FEED_EVENTS.USER_PRESENCE, ({ recipientId, presence }: { recipientId: string; presence: PRESENCE }) => {
            setLocalResults((prevState) => prevState.map((item) => {
                if (FeedTypes.CONVERSATION === item.type && item.recipient._id === recipientId) {
                    return { ...item, recipient: { ...item.recipient, presence } };
                }
                
                return item;
            }));
        })

        socket?.on(FEED_EVENTS.START_TYPING, (data: { _id: string; participant: TypingParticipant }) => {
            setLocalResults((prevState) => prevState.map((item) => {
                if (item._id === data._id) {
                    return {
                        ...item, 
                        participantsTyping: item.participantsTyping ? [...item.participantsTyping, data.participant] : [data.participant]
                    }
                }

                return item;
            }));
        })

        socket?.on(FEED_EVENTS.STOP_TYPING, (data: { _id: string; participant: Omit<TypingParticipant, 'name'> }) => {
            setLocalResults((prevState) => prevState.map((item) => {
                if (item._id === data._id) {
                    return {
                        ...item, 
                        participantsTyping: item.participantsTyping?.filter((participant) => participant._id !== data.participant._id)
                    }
                }

                return item;
            }));
        })

        return () => {
            socket?.off(FEED_EVENTS.CREATE_CONVERSATION);
            socket?.off(FEED_EVENTS.DELETE_CONVERSATION);
            
            socket?.off(FEED_EVENTS.CREATE_MESSAGE);
            socket?.off(FEED_EVENTS.DELETE_MESSAGE);

            socket?.off(FEED_EVENTS.START_TYPING);
            socket?.off(FEED_EVENTS.STOP_TYPING);

            socket?.off(FEED_EVENTS.USER_PRESENCE);
        };
    }, [socket, updateFeed]);
}