import React from "react"
import { PRESENCE } from "@/shared/model/types"
import { useConversationCtx } from "../model/context"
import { useNavigate, useParams } from "react-router-dom"
import { useSession } from "@/entities/session"
import { Message } from "@/entities/Message/model/types"
import { CONVERSATION_EVENTS, Conversation } from "../model/types"
import { useSocket } from "@/shared/lib/hooks/useSocket"
import { useDomEvents } from "@/shared/model/store"

export const useConversationEvents = () => {
    const { id: recipientId } = useParams();
    const { socket } = useSocket();
    const { addEventListener } = useDomEvents();
    const { setConversation, getConversation, setIsRecipientTyping, abortController } = useConversationCtx((state) => ({ 
        setConversation: state.setConversation, 
        getConversation: state.getConversation,
        setIsRecipientTyping: state.setIsRecipientTyping,
        abortController: state.abortController 
    }));
    
    const userId = useSession((state) => state.userId);
    
    const navigate = useNavigate();

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
                [id === userId ? 'isInitiatorBlocked' : 'isRecipientBlocked']: true
            }
        }))
    }, [])

    const onUnblock = React.useCallback((id: string) => {
        setConversation((prev) => ({
            ...prev,
            conversation: {
                ...prev.conversation,
                isInitiatorBlocked: id === userId ? false : prev.conversation.isInitiatorBlocked,
                isRecipientBlocked: id === prev.conversation.recipient._id ? false : prev.conversation.isRecipientBlocked
            }
        }))
    }, [])

    const onNewMessage = React.useCallback((message: Message & { conversationId: string }) => {
        setConversation((prev) => ({
            ...prev,
            conversation: { ...prev.conversation, messages: [...prev.conversation.messages, message] }
        }));
    }, []);

    const onEditMessage = React.useCallback((editedMessage: Message) => {
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
}