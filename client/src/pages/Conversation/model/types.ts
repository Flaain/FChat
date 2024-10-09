import { Message } from '@/entities/Message/model/types';
import { ChatStore } from '@/shared/lib/providers/chat/types';
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
    status: ConversationStatuses;
    isPreviousMessagesLoading: boolean;
    error: string | null;
    isRecipientTyping: boolean;
    isRefetching: boolean;
    actions: {
        getConversation: (action: 'init' | 'refetch', recipientId: string, setChatState: (state: Partial<ChatStore>) => void, abortController?: AbortController) => Promise<void>;
        getPreviousMessages: () => Promise<void>;
        handleTypingStatus: () => () => void;
    }
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
    data: {
        recipient: Pick<Recipient, 'presence' | 'lastSeenAt'>
    } & Pick<Conversation, 'isInitiatorBlocked' | 'isRecipientBlocked'>;
    shouldDisplayTypingStatus?: boolean;
    isRecipientTyping: boolean;
}