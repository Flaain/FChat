import { Message } from 'src/message/schemas/message.schema';

export enum STATIC_CONVERSATION_EVENTS {
    JOIN = 'conversation.join',
    LEAVE = 'conversation.leave',
    SEND_MESSAGE = 'conversation.message.send',
    EDIT_MESSAGE = 'conversation.message.edit',
    DELETE_MESSAGE = 'conversation.message.delete',
    CREATED = 'conversation.created',
    DELETED = 'conversation.deleted',
}

export enum FEED_EVENTS {
    NEW_MESSAGE = 'feed.new.message',
    EDIT_MESSAGE = 'feed.edit.message',
    DELETE_MESSAGE = 'feed.delete.message',
    NEW_CONVERSATION = 'feed.new.conversation',
}

export interface ConversationDeleteMessageParams {
    messageId: string;
    conversationId: string;
    initiatorId: string;
    recipientId: string;
    isLastMessage: boolean;
    lastMessage: Message;
    lastMessageSentAt: Date;
}

export interface ConversationSendMessageParams {
    message: Message & { _id: string };
    recipientId: string;
    initiatorId: string;
    conversationId: string;
}

export interface ConversationCreateParams {
    initiatorId: string;
    conversationId: string;
    recipientId: string;
    lastMessageSentAt: Date;
}