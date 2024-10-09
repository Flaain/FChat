import React from 'react';
import { CONVERSATION_EVENTS, ConversationStore } from './types';
import { useNavigate, useParams } from 'react-router-dom';
import { ConversationContext } from './context';
import { PRESENCE } from '@/shared/model/types';
import { Message } from '@/entities/Message/model/types';
import { useEvents, useSocket } from '@/shared/model/store';
import { useSession } from '@/entities/session';
import { createStore } from 'zustand';
import { conversationActions } from './actions';
import { useChat } from '@/shared/lib/providers/chat/context';

const initialState: Omit<ConversationStore, 'actions'> = {
    data: null!,
    error: null,
    isPreviousMessagesLoading: false,
    isRecipientTyping: false,
    isRefetching: false,
    status: 'loading'
};

export const ConversationProvider = ({ children }: { children: React.ReactNode }) => {
    const { id: recipientId } = useParams() as { id: string };
    const { 0: store } = React.useState(() => createStore<ConversationStore>((set, get) => ({ 
        ...initialState, 
        actions: conversationActions(set, get) 
    })));
    
    const socket = useSocket((state) => state.socket);
    const userId = useSession((state) => state.userId)

    const addEventListener = useEvents((state) => state.addEventListener);
    const setChatState = useChat((state) => state.actions.setChatState);
    const navigate = useNavigate();

    React.useEffect(() => {
        const abortController = new AbortController();

        store.getState().actions.getConversation('init', recipientId, setChatState, abortController);

        const removeEventListener = addEventListener('keydown', (event) => {
            event.key === 'Escape' && navigate('/');
        });

        socket?.emit(CONVERSATION_EVENTS.JOIN, { recipientId });

        socket?.io.on('reconnect', () => {
            socket?.emit(CONVERSATION_EVENTS.JOIN, { recipientId });
        });

        socket?.on(CONVERSATION_EVENTS.USER_PRESENCE, ({ presence, lastSeenAt }: { presence: PRESENCE; lastSeenAt?: string }) => {
            store.setState((prevState) => ({
                data: {
                    ...prevState.data,
                    conversation: {
                        ...prevState.data.conversation,
                        recipient: {
                            ...prevState.data.conversation.recipient,
                            lastSeenAt: lastSeenAt || prevState.data.conversation.recipient.lastSeenAt,
                            presence
                        }
                    }
                }
            }));
        });

        socket?.on(CONVERSATION_EVENTS.USER_BLOCK, (id: string) => {
            store.setState((prevState) => ({
                data: {
                    ...prevState.data,
                    conversation: {
                        ...prevState.data.conversation,
                        [id === userId ? 'isInitiatorBlocked' : 'isRecipientBlocked']: true
                    }
                }
            }));

            setChatState({ isContextActionsBlocked: true });
        });

        socket?.on(CONVERSATION_EVENTS.USER_UNBLOCK, (id: string) => {
            store.setState((prevState) => {
                const isInitiatorBlocked = id === userId ? false : prevState.data.conversation.isInitiatorBlocked;
                const isRecipientBlocked = id === recipientId ? false : prevState.data.conversation.isRecipientBlocked;

                setChatState({ isContextActionsBlocked: isInitiatorBlocked || isRecipientBlocked });

                return {
                    data: {
                        ...prevState.data,
                        conversation: {
                            ...prevState.data.conversation,
                            isInitiatorBlocked,
                            isRecipientBlocked
                        }
                    }
                }
            });
        });

        socket?.on(CONVERSATION_EVENTS.MESSAGE_SEND, (message: Message & { conversationId: string }) => {
            store.setState((prevState) => ({
                data: {
                    ...prevState.data,
                    conversation: {
                        ...prevState.data.conversation,
                        messages: [...prevState.data.conversation.messages, message]
                    }
                }
            }));
        });

        socket?.on(CONVERSATION_EVENTS.MESSAGE_EDIT, (editedMessage: Message) => {
            console.log(editedMessage)
            store.setState((prevState) => ({
                data: {
                    ...prevState.data,
                    conversation: {
                        ...prevState.data.conversation,
                        messages: prevState.data.conversation.messages.map((message) => message._id === editedMessage._id ? editedMessage : message)
                    }
                }
            }));
        });

        socket?.on(CONVERSATION_EVENTS.MESSAGE_DELETE, (messageIds: Array<string>) => {
            store.setState((prevState) => ({
                data: {
                    ...prevState.data,
                    conversation: {
                        ...prevState.data.conversation,
                        messages: prevState.data.conversation.messages.filter((message) => !messageIds.includes(message._id))
                    }
                }
            }));
        });

        socket?.on(CONVERSATION_EVENTS.CREATED, (_id: string) => {
            store.setState((prevState) => ({
                data: {
                    ...prevState.data,
                    conversation: {
                        ...prevState.data.conversation,
                        _id
                    }
                }
            }));
        });

        socket?.on(CONVERSATION_EVENTS.DELETED, () => navigate('/'));
        socket?.on(CONVERSATION_EVENTS.START_TYPING, () => store.setState({ isRecipientTyping: true }));
        socket?.on(CONVERSATION_EVENTS.STOP_TYPING, () => store.setState({ isRecipientTyping: false }));

        return () => {
            removeEventListener();

            setChatState({ mode: 'default', selectedMessages: new Map(), showAnchor: false });

            abortController.abort('Signal aborted due to new incoming request');

            socket?.emit(CONVERSATION_EVENTS.LEAVE, { recipientId });

            socket?.off(CONVERSATION_EVENTS.USER_PRESENCE);
            socket?.off(CONVERSATION_EVENTS.USER_BLOCK);
            socket?.off(CONVERSATION_EVENTS.USER_UNBLOCK);

            socket?.off(CONVERSATION_EVENTS.MESSAGE_SEND);
            socket?.off(CONVERSATION_EVENTS.MESSAGE_EDIT);
            socket?.off(CONVERSATION_EVENTS.MESSAGE_DELETE);

            socket?.off(CONVERSATION_EVENTS.CREATED);
            socket?.off(CONVERSATION_EVENTS.DELETED);

            socket?.off(CONVERSATION_EVENTS.START_TYPING);
            socket?.off(CONVERSATION_EVENTS.STOP_TYPING);

            socket?.off('reconnect');
        };
    }, [recipientId]);

    return (
        <ConversationContext.Provider value={store}>
            {children}
        </ConversationContext.Provider>
    );
};