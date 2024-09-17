import { Message } from '@/entities/Message/model/types';
import { APIData, Recipient, WithParams, WithRequired } from '@/shared/model/types';

export type ConversationStatuses = 'idle' | 'loading' | 'error';

export interface IConversationAPI {
    create: (body: { recipientId: string }) => Promise<APIData<Pick<Conversation, '_id' | 'lastMessageSentAt'>>>;
    get: (body: Omit<WithParams<{ recipientId: string }>, 'params'>) => Promise<APIData<ConversationWithMeta>>;
    getPreviousMessages: (body: WithRequired<WithParams<{ recipientId: string }>, 'params'>) => Promise<APIData<{ messages: Array<Message>, nextCursor: string | null }>>;
}

export interface ConversationWithMeta {
    conversation: Pick<Conversation, '_id' | 'recipient' | 'messages' | 'createdAt' | 'isInitiatorBlocked' | 'isRecipientBlocked'>;
    nextCursor: string | null;
}

export enum CONVERSATION_EVENTS {
    JOIN = 'conversation.join',
    LEAVE = 'conversation.leave',
    CREATED = 'conversation.created',
    DELETED = 'conversation.deleted',
    MESSAGE_SEND = 'conversation.message.send',
    MESSAGE_EDIT = 'conversation.message.edit',
    MESSAGE_DELETE = 'conversation.message.delete',
    USER_PRESENCE = 'conversation.user.presence',
    USER_BLOCK = 'conversation.user.block',
    USER_UNBLOCK = 'conversation.user.unblock',
    START_TYPING = 'conversation.start.typing',
    STOP_TYPING = 'conversation.stop.typing'
}

export interface ConversationStore {
    data: ConversationWithMeta;
    abortController: { current: AbortController | null };
    status: ConversationStatuses;
    isPreviousMessagesLoading: boolean;
    getConversation: (action: 'init' | 'refetch') => Promise<void>;
    getPreviousMessages: () => Promise<void>;
    error: string | null;
    isRecipientTyping: boolean;
    isRefetching: boolean;
    refetch: () => Promise<void>;
    setConversation: (cb: (prevState: ConversationWithMeta) => ConversationWithMeta) => void;
    setIsRecipientTyping: (value: boolean) => void;
    openDetails: () => void;
    closeDetails: () => void;
    destroy: () => void;
    showRecipientDetails: boolean;
}

export interface Conversation {
    _id: string;
    recipient: Recipient;
    messages: Array<Message>;
    lastMessage?: Message;
    lastMessageSentAt: string;
    createdAt: string;
    updatedAt: string;
    isInitiatorBlocked?: boolean;
    isRecipientBlocked?: boolean;
}

export interface GetDescriptionParams {
    data: Pick<ConversationWithMeta, 'conversation'>;
    shouldDisplayTypingStatus?: boolean;
    isRecipientTyping: boolean;
}