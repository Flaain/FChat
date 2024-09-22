import React from "react"
import { CONVERSATION_EVENTS, ConversationStatuses, ConversationWithMeta, IConversationContext } from "./types"
import { conversationAPI } from "../api";
import { useNavigate, useParams } from "react-router-dom";
import { AppException } from "@/shared/api/error";
import { toast } from "sonner";
import { useSocket } from "@/shared/lib/providers/socket/context";
import { ConversationContext } from "./context";
import { PRESENCE } from "@/shared/model/types";
import { useSession } from "@/entities/session";
import { Message } from "@/entities/Message/model/types";
import { useEvents } from "@/shared/lib/providers/events/context";
import { MAX_SCROLL_BOTTOM, MIN_SCROLL_BOTTOM } from "@/widgets/MessagesList/model/constants";
import { getScrollBottom } from "@/shared/lib/utils/getScrollBottom";

export const ConversationProvider = ({ children }: { children: React.ReactNode }) => {
    const { id: recipientId, } = useParams() as { id: string };
    const { socket } = useSocket();
    const { state: { userId } } = useSession();
    const { addEventListener } = useEvents();

    const [data, setData] = React.useState<ConversationWithMeta>(null!);
    const [status, setStatus] = React.useState<ConversationStatuses>('loading');
    const [isRecipientTyping, setIsRecipientTyping] = React.useState(false);
    const [isPreviousMessagesLoading, setIsPreviousMessagesLoading] = React.useState(false);
    const [isRefetching, setIsRefetching] = React.useState(false);
    const [isTyping, setIsTyping] = React.useState(false);
    const [showRecipientDetails, setShowRecipientDetails] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [showAnchor, setShowAnchor] = React.useState(false);

    const abortController = React.useRef<AbortController | null>(null);
    const typingTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const listRef = React.useRef<HTMLUListElement | null>(null);
    const lastMessageRef = React.useRef<HTMLLIElement | null>(null);

    const navigate = useNavigate();

    const getConversation = async (action: 'init' | 'refetch') => {
        try {
            abortController.current?.abort('Signal aborted due to new incoming request');
            abortController.current = new AbortController();

            action === 'init' ? setStatus('loading') : setIsRefetching(true);

            const { data } = await conversationAPI.get({ recipientId, signal: abortController.current.signal });
            
            setData(data);
            setStatus('idle');
            setError(null);
        } catch (error) {
            console.error(error);
            
            if (error instanceof AppException) {
                 if (error.statusCode === 404) {
                    navigate('/');
                } else {
                    setStatus('error');
                    setError(error.message);
                }
            }
        } finally {
            setIsRefetching(false);
        }
    }

    const getPreviousMessages = async () => {
        try {
            setIsPreviousMessagesLoading(true);
            
            const { data: previousMessages } = await conversationAPI.getPreviousMessages({ 
                recipientId,
                params: { cursor: data.nextCursor! } 
            })

            setData((prevState) => ({
                ...prevState,
                conversation: {
                    ...prevState.conversation,
                    messages: [...previousMessages.messages, ...prevState.conversation.messages]
                },
                nextCursor: previousMessages.nextCursor
            }));
        } catch (error) {
            console.error(error);
            toast.error('Cannot get previous messages', { position: 'top-center' });
        } finally {
            setIsPreviousMessagesLoading(false);
        }
    }

    const handleTypingStatus = () => {
        const typingData = { conversationId: data.conversation._id, recipientId: data.conversation.recipient._id };

        if (!isTyping) {
            setIsTyping(true);
            
            socket.emit(CONVERSATION_EVENTS.START_TYPING, typingData);
        } else {
            clearTimeout(typingTimeoutRef?.current!);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            
            socket.emit(CONVERSATION_EVENTS.STOP_TYPING, typingData);
        }, 5000);
    }

    React.useEffect(() => {
        getConversation('init');

        const removeEventListener = addEventListener('keydown', (event) => {
            event.key === 'Escape' && navigate('/');
        })

        socket?.emit(CONVERSATION_EVENTS.JOIN, { recipientId });
        
        socket?.io.on('reconnect', () => {
            socket?.emit(CONVERSATION_EVENTS.JOIN, { recipientId });
        })

        socket?.on(CONVERSATION_EVENTS.USER_PRESENCE, ({ presence, lastSeenAt }: { presence: PRESENCE, lastSeenAt?: string }) => {
            setData((prevState) => ({ 
                ...prevState, 
                conversation: {
                    ...prevState.conversation,
                    recipient: {
                        ...prevState.conversation.recipient,
                        lastSeenAt: lastSeenAt || prevState.conversation.recipient.lastSeenAt,
                        presence
                    }
                }
            }))
        });
        
        socket?.on(CONVERSATION_EVENTS.USER_BLOCK, (id: string) => {
            setData((prevState) => ({
                ...prevState,
                conversation: {
                    ...prevState.conversation,
                    [id === userId ? 'isInitiatorBlocked' : 'isRecipientBlocked']: true
                }
            }))
        });

        socket?.on(CONVERSATION_EVENTS.USER_UNBLOCK, (id: string) => {
            setData((prevState) => ({
                ...prevState,
                conversation: {
                    ...prevState.conversation,
                    isInitiatorBlocked: id === userId ? false : prevState.conversation.isInitiatorBlocked,
                    isRecipientBlocked: id === prevState.conversation.recipient._id ? false : prevState.conversation.isRecipientBlocked
                }
            }))
        });

        socket?.on(CONVERSATION_EVENTS.MESSAGE_SEND, (message: Message & { conversationId: string }) => {
            setData((prevState) => ({
                ...prevState,
                conversation: { ...prevState.conversation, messages: [...prevState.conversation.messages, message] }
            }));
        });

        socket?.on(CONVERSATION_EVENTS.MESSAGE_EDIT, (editedMessage: Message) => {
            setData((prevState) => ({
                ...prevState,
                conversation: {
                    ...prevState.conversation,
                    messages: prevState.conversation.messages.map((message) => message._id === editedMessage._id ? editedMessage : message)
                }
            }));
        });

        socket?.on(CONVERSATION_EVENTS.MESSAGE_DELETE, (messageId: string) => {
            setData((prevState) => ({
                ...prevState,
                conversation: {
                    ...prevState.conversation,
                    messages: prevState.conversation.messages.filter((message) => message._id !== messageId)
                }
            }))
        });
        
        socket?.on(CONVERSATION_EVENTS.CREATED, (_id: string) => {
            setData((prevState) => ({ ...prevState, conversation: { ...prevState.conversation, _id } }));
        });

        socket?.on(CONVERSATION_EVENTS.DELETED, () => navigate('/'));
        socket?.on(CONVERSATION_EVENTS.START_TYPING, () => setIsRecipientTyping(true));
        socket?.on(CONVERSATION_EVENTS.STOP_TYPING, () => setIsRecipientTyping(false));

        return () => {
            removeEventListener();
            
            abortController.current?.abort('Signal aborted due to new incoming request');

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

    React.useEffect(() => {
        if (!listRef.current) return;

        const handleScrollContainer = () => {
            const { scrollTop } = listRef.current as HTMLUListElement;

            data.nextCursor && !isPreviousMessagesLoading && !scrollTop && getPreviousMessages();

            setShowAnchor(getScrollBottom(listRef.current!) >= MAX_SCROLL_BOTTOM);
        };

        listRef.current?.addEventListener('scroll', handleScrollContainer);

        return () => {
            listRef.current?.removeEventListener('scroll', handleScrollContainer);
        };
    }, [data.nextCursor, isPreviousMessagesLoading]);

    React.useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'instant' });
    }, [])

    React.useEffect(() => {
        if (!listRef.current || !lastMessageRef.current) return;
        
        const scrollBottom = getScrollBottom(listRef.current!);

        scrollBottom <= MIN_SCROLL_BOTTOM ? lastMessageRef.current.scrollIntoView({ behavior: 'smooth' }) : scrollBottom >= MAX_SCROLL_BOTTOM && setShowAnchor(true);
    }, [data.conversation.messages]);

    const value: IConversationContext = {
        data,
        status,
        isPreviousMessagesLoading,
        showRecipientDetails,
        error,
        lastMessageRef,
        isRecipientTyping,
        isRefetching,
        isTyping,
        listRef,
        getPreviousMessages,
        refetch: () => getConversation('refetch'),
        handleTypingStatus,
        onDetails: setShowRecipientDetails,
    }

    return (
        <ConversationContext.Provider value={value}>
            {children}
        </ConversationContext.Provider>
    )
}