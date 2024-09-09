import React from 'react';
import { api } from '@/shared/api';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ConversationStatuses, ConversationWithMeta } from '../../model/types';
import { Conversation, IMessage, CONVERSATION_EVENTS, PRESENCE } from '@/shared/model/types';
import { useLayoutContext } from '@/shared/lib/hooks/useLayoutContext';
import { AppException } from '@/shared/api/error';
import { useProfile } from '@/shared/lib/hooks/useProfile';
import { getRelativeTimeString } from '@/shared/lib/utils/getRelativeTimeString';
import { useDomEvents } from '@/shared/lib/hooks/useDomEvents';

export const useConversation = () => {
    const { id: recipientId } = useParams<{ id: string }>();
    const { profile } = useProfile();
    const { socket } = useLayoutContext();
    const { addEventListener } = useDomEvents();

    const [searchParams, setSearchParams] = useSearchParams();
    const [data, setConversation] = React.useState<ConversationWithMeta>(null!);
    const [status, setStatus] = React.useState<ConversationStatuses>('loading');
    const [error, setError] = React.useState<string | null>(null);
    const [isRefetching, setIsRefetching] = React.useState(false);
    const [isPreviousMessagesLoading, setIsPreviousMessagesLoading] = React.useState(false);
    const [isTyping, setIsTyping] = React.useState(false);
    const [isRecipientTyping, setIsRecipientTyping] = React.useState(false);
    const [showRecipientDetails, setShowRecipientDetails] = React.useState(searchParams.get('details') === 'open');
    const [showAcnhor, setShowAnchor] = React.useState(false);

    const listRef = React.useRef<HTMLUListElement | null>(null);
    const abortControllerRef = React.useRef<AbortController | null>(null);
    const typingTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const isRecipientOnline = data?.conversation.recipient.presence === PRESENCE.ONLINE; 

    const handleTypingStatus = () => {
        const typingData = { conversationId: data.conversation._id, recipientId };

        if (!isTyping) {
            setIsTyping(true);
            
            socket?.emit(CONVERSATION_EVENTS.START_TYPING, typingData);
        } else {
            clearTimeout(typingTimeoutRef.current!);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            
            socket?.emit(CONVERSATION_EVENTS.STOP_TYPING, typingData);
        }, 5000);
    };
    
    const handleAnchorClick = React.useCallback(() => {
        listRef.current?.scrollTo({ left: 0, top: listRef.current.scrollHeight - listRef.current.clientHeight, behavior: 'smooth' });
    }, []);

    const getConversationDescription = (shouldDisplayTypingStatus = true) => {
        if (data.conversation.isInitiatorBlocked || data.conversation.isRecipientBlocked) return 'last seen recently';
        if (isRecipientTyping && isRecipientOnline && shouldDisplayTypingStatus) return `typing...`;

        return isRecipientOnline ? 'online' : `last seen ${getRelativeTimeString(data.conversation.recipient.lastSeenAt, 'en-US')}`;
    }

    const openDetails = React.useCallback(() => {
        setShowRecipientDetails(true);
        setSearchParams((prevState) => {
            prevState.set('details', 'open');

            return prevState;
        })
    }, [])
    
    const closeDetails = React.useCallback(() => {
        setShowRecipientDetails(false);
        setSearchParams((prevState) => {
            prevState.delete('details');
    
            return prevState;
        })
    }, [])

    const onUserPresence = React.useCallback(({ presence, lastSeenAt }: { presence: PRESENCE, lastSeenAt?: string }) => {
        setConversation((prevState) => ({ 
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
    }, [])

    const onBlock = React.useCallback((id: string) => {
        setConversation((prev) => ({
            ...prev,
            conversation: {
                ...prev.conversation,
                [id === profile._id ? 'isInitiatorBlocked' : 'isRecipientBlocked']: true
            }
        }))
    }, [])

    const onUnblock = React.useCallback((id: string) => {
        setConversation((prev) => ({
            ...prev,
            conversation: {
                ...prev.conversation,
                isInitiatorBlocked: id === profile._id ? false : prev.conversation.isInitiatorBlocked,
                isRecipientBlocked: id === prev.conversation.recipient._id ? false : prev.conversation.isRecipientBlocked
            }
        }))
    }, [])

    const getPreviousMessages = async () => {
        try {
            setIsPreviousMessagesLoading(true);

            const { data: previousMessages } = await api.conversation.getPreviousMessages({ 
                recipientId: data.conversation.recipient._id,
                params: { cursor: data.nextCursor! } 
            })

            setConversation((prev) => ({
                ...prev,
                conversation: {
                    ...prev.conversation,
                    messages: [...previousMessages.messages, ...prev.conversation.messages]
                },
                nextCursor: previousMessages.nextCursor
            }));
        } catch (error) {
            console.error(error);
        } finally {
            setIsPreviousMessagesLoading(false);
        }
    };

    const navigate = useNavigate();

    const onNewMessage = React.useCallback((message: IMessage & { conversationId: string }) => {
        setConversation((prev) => ({
            ...prev,
            conversation: { ...prev.conversation, messages: [...prev.conversation.messages, message] }
        }));
    }, []);

    const onEditMessage = React.useCallback((editedMessage: IMessage) => {
        setConversation((prev) => ({
            ...prev,
            conversation: {
                ...prev.conversation,
                messages: prev.conversation.messages.map((message) => message._id === editedMessage._id ? editedMessage : message)
            }
        }));
    }, []);

    const onCreateConversation = React.useCallback(({ _id }: Pick<Conversation, '_id' | 'lastMessageSentAt'>) => {
        setConversation((prevState) => ({ ...prevState, conversation: { ...prevState.conversation, _id } }));
    }, []);

    const onDeleteMessage = React.useCallback((messageId: string) => {
        setConversation((prev) => ({
            ...prev,
            conversation: {
                ...prev.conversation,
                messages: prev.conversation.messages.filter((message) => message._id !== messageId)
            }
        }))
    }, []);

    const getConversation = React.useCallback(async (action: 'init' | 'refetch') => {
        try {
            abortControllerRef.current?.abort('Signal aborted due to new incoming request');
            abortControllerRef.current = new AbortController();

            action === 'init' ? setStatus('loading') : setIsRefetching(true);

            const { data: response } = await api.conversation.get({ 
                recipientId: recipientId!, 
                signal: abortControllerRef.current.signal 
            });
            
            setConversation(response);
            setStatus('idle');
            setError(null);
        } catch (error) {
            console.error(error);
            
            if (error instanceof AppException) {
                error.statusCode === 404 && navigate('/');

                setStatus('error');
                setError(error.message);
            }
        } finally {
            setIsRefetching(false);
        }
    }, [recipientId])

    React.useEffect(() => {
        getConversation('init');

        const removeEventListener = addEventListener('keydown', (event) => {
            event.key === 'Escape' && navigate('/');
        })

        socket?.emit(CONVERSATION_EVENTS.JOIN, { recipientId });
        
        socket?.io.on('reconnect', () => {
            socket?.emit(CONVERSATION_EVENTS.JOIN, { recipientId });
        })
        socket?.on(CONVERSATION_EVENTS.USER_PRESENCE, onUserPresence);
        socket?.on(CONVERSATION_EVENTS.USER_BLOCK, onBlock);
        socket?.on(CONVERSATION_EVENTS.USER_UNBLOCK, onUnblock);

        socket?.on(CONVERSATION_EVENTS.MESSAGE_SEND, onNewMessage);
        socket?.on(CONVERSATION_EVENTS.MESSAGE_EDIT, onEditMessage);
        socket?.on(CONVERSATION_EVENTS.MESSAGE_DELETE, onDeleteMessage);
        
        socket?.on(CONVERSATION_EVENTS.CREATED, onCreateConversation);
        socket?.on(CONVERSATION_EVENTS.DELETED, () => navigate('/'));

        socket?.on(CONVERSATION_EVENTS.START_TYPING, () => setIsRecipientTyping(true));
        socket?.on(CONVERSATION_EVENTS.STOP_TYPING, () => setIsRecipientTyping(false));

        return () => {
            removeEventListener();
            
            abortControllerRef.current?.abort('Signal aborted due to new incoming request');

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

    return {
        data,
        status,
        error,
        listRef,
        isRefetching,
        isRecipientTyping,
        isPreviousMessagesLoading,
        showAcnhor,
        setShowAnchor,
        openDetails,
        closeDetails,
        handleTypingStatus,
        handleAnchorClick,
        getConversationDescription,
        setShowRecipientDetails,
        setConversation,
        showRecipientDetails,
        getPreviousMessages,
        refetch: () => getConversation('refetch')
    };
};