import React from "react";
import { api } from "@/shared/api";
import {
    ConversationFeed,
    DeleteMessageEventParams,
    FEED_EVENTS,
    FeedItem,
    FeedTypes,
    GroupFeed,
    PRESENCE,
    TypingParticipant,
    UserFeed,
    WithMeta
} from '@/shared/model/types';
import { debounce } from "@/shared/lib/utils/debounce";
import { MIN_USER_SEARCH_LENGTH } from "@/shared/constants";
import { sessionAPI, useSession } from "@/entities/session";
import { useSocket } from "@/shared/lib/providers/socket/context";
import { Message } from "@/entities/Message/model/types";
import { getSortedFeedByLastMessage } from "@/shared/lib/utils/getSortedFeedByLastMessage";
import { SessionTypes } from "@/entities/session/model/types";

export const useSidebar = () => {
    const { socket } = useSocket();
    const { dispatch } = useSession();

    const [globalResults, setGlobalResults] = React.useState<WithMeta<Array<UserFeed | GroupFeed>> | null>(null);
    const [localResults, setLocalResults] = React.useState<Array<ConversationFeed | GroupFeed>>([]);
    const [searchLoading, setSearchLoading] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState('');
    
    const trimmedSearchValue = searchValue.trim().toLowerCase();

    const localFilters: Record<Exclude<FeedTypes, 'User'>, (item: FeedItem) => boolean> = {
        Conversation: (item: FeedItem) =>
            (item as ConversationFeed).recipient.name.toLowerCase().includes(trimmedSearchValue) ||
            (item as ConversationFeed).recipient.login.toLowerCase().includes(trimmedSearchValue),
        Group: (item: FeedItem) =>
            (item as GroupFeed).name.toLowerCase().includes(trimmedSearchValue) ||
            (item as GroupFeed).login.toLowerCase().includes(trimmedSearchValue)
    };

    const globalFilters: Record<Exclude<FeedTypes, 'Conversation'>, (item: FeedItem) => boolean> = {
        User: (item: FeedItem) => localResults.some((localItem) => localItem.type === FeedTypes.CONVERSATION && localItem.recipient._id === item._id),
        Group: (item: FeedItem) => localResults.some((localItem) => localItem._id === item._id)
    };

    const filteredLocalResults = localResults.filter((item) => localFilters[item.type](item));
    const filteredGlobalResults = globalResults?.items.filter((item) => !globalFilters[item.type](item));
    
    React.useEffect(() => {
        (async () => {
            try {
                const { data } = await api.feed.get();

                setLocalResults(data.feed);
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

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

        socket?.on(FEED_EVENTS.CREATE_MESSAGE, ({ message, id }: { message: Message; id: string }) => {
            updateFeed({ lastMessage: message, lastActionAt: message.createdAt }, id, true);
        });

        socket?.on(FEED_EVENTS.EDIT_MESSAGE, ({ message, id }: { message: Message; id: string }) => {
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

    const searchInputRef = React.useRef<HTMLInputElement | null>(null);

    const resetSearch = () => {
        setSearchValue('');
        setGlobalResults(null);
    }

    const handleLogout = React.useCallback(async () => {
        await sessionAPI.logout();
        dispatch({ type: SessionTypes.LOGOUT });
    }, []);

    const handleSearch = React.useCallback(({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        if (!value) {
            setSearchValue('');
            setGlobalResults(null);
            return;
        }

        const trimmedValue = value.trim();

        setSearchValue(!trimmedValue.length ? '' : value);

        if(trimmedValue.length > MIN_USER_SEARCH_LENGTH) {
            setSearchLoading(true);
            handleSearchDelay(trimmedValue);
        }
    }, []);

    const handleSearchDelay = React.useCallback(debounce(async (value: string) => {
        try {
            const { data } = await api.feed.search({ query: value });

            setGlobalResults(data);
        } catch (error) {
            console.error(error);
            setGlobalResults(null);
        } finally {
            setSearchLoading(false);
        }
    }, 500), []);

    return {
        feed: {
            filteredLocalResults,
            filteredGlobalResults,
            isFeedEmpty: !trimmedSearchValue.length && !localResults.length && !globalResults?.items.length,
            searchValue: trimmedSearchValue,
            searchLoading,
        },
        handleSearch,
        handleLogout,
        resetSearch,
        searchInputRef
    }
}