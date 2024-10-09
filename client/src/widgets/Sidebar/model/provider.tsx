import React from 'react';
import { createStore } from 'zustand';
import { SidebarStore } from './types';
import { sidebarActions } from './actions';
import { useSocket } from '@/shared/model/store';
import { ConversationFeed, DeleteMessageEventParams, FEED_EVENTS, FeedTypes, PRESENCE, TypingParticipant } from '@/shared/model/types';
import { Message } from '@/entities/Message/model/types';
import { getSortedFeedByLastMessage } from '@/shared/lib/utils/getSortedFeedByLastMessage';
import { SidebarContext } from './context';

const initialState: Omit<SidebarStore, 'actions'> = {
    localResults: { feed: [], nextCursor: null },
    searchRef: React.createRef(),
    localResultsError: null,
    globalResults: null,
    isSearching: false,
    searchValue: ''
};

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
    const { 0: store } = React.useState(() => createStore<SidebarStore>((set, get) => ({ ...initialState, actions: sidebarActions(set, get) })));
    
    const socket = useSocket((state) => state.socket);

    React.useEffect(() => {
        store.getState().actions.getFeed();
    }, [])

    React.useEffect(() => {
        socket?.on(FEED_EVENTS.CREATE_CONVERSATION, (conversation: ConversationFeed) => {
            store.setState((prevState) => ({ 
                localResults: { 
                    ...prevState.localResults, 
                    feed: [{ ...conversation, type: FeedTypes.CONVERSATION }, ...prevState.localResults.feed] 
                } 
            }));
        });

        socket?.on(FEED_EVENTS.CREATE_MESSAGE, ({ message, id }: { message: Message; id: string }) => {
            store.getState().actions.updateFeed({ lastMessage: message, lastActionAt: message.createdAt }, id, true);
        });

        socket?.on(FEED_EVENTS.EDIT_MESSAGE, ({ message, id }: { message: Message; id: string }) => {
            store.getState().actions.updateFeed({ lastMessage: message, lastActionAt: message.createdAt }, id);
        })

        socket?.on(FEED_EVENTS.DELETE_MESSAGE, ({ lastMessage, lastMessageSentAt, id }: DeleteMessageEventParams) => {
            store.getState().actions.updateFeed({ lastMessage, lastActionAt: lastMessageSentAt }, id, true);
        });

        socket?.on(FEED_EVENTS.DELETE_CONVERSATION, (id: string) => {
            store.setState((prevState) => ({
                localResults: {
                    ...prevState.localResults,
                    feed: prevState.localResults.feed.filter((item) => item._id !== id).sort(getSortedFeedByLastMessage)
                }
            }));
        })
        
        socket?.on(FEED_EVENTS.USER_PRESENCE, ({ recipientId, presence }: { recipientId: string; presence: PRESENCE }) => {
            store.setState((prevState) => ({
                localResults: {
                    ...prevState.localResults,
                    feed: prevState.localResults.feed.map((item) => {
                        if (FeedTypes.CONVERSATION === item.type && item.recipient._id === recipientId) {
                            return { ...item, recipient: { ...item.recipient, presence } };
                        }

                        return item;
                    })
                }
            }));
        });

        socket?.on(FEED_EVENTS.START_TYPING, (data: { _id: string; participant: TypingParticipant }) => {
            store.setState((prevState) => ({
                localResults: {
                    ...prevState.localResults,
                    feed: prevState.localResults.feed.map((item) => {
                        if (item._id === data._id) {
                            return {
                                ...item, 
                                participantsTyping: item.participantsTyping ? [...item.participantsTyping, data.participant] : [data.participant]
                            }
                        }
        
                        return item;
                    })
                }
            }))
        })

        socket?.on(FEED_EVENTS.STOP_TYPING, (data: { _id: string; participant: Omit<TypingParticipant, 'name'> }) => {
            store.setState((prevState) => ({
                localResults: {
                    ...prevState.localResults,
                    feed: prevState.localResults.feed.map((item) => {
                        if (item._id === data._id) {
                            return {
                                ...item, 
                                participantsTyping: item.participantsTyping?.filter((participant) => participant._id !== data.participant._id)
                            }
                        }
        
                        return item;
                    })
                }
            }))
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
    }, [socket]);

    return <SidebarContext.Provider value={store}>{children}</SidebarContext.Provider>;
};