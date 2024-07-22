import { Message } from "src/modules/message/schemas/message.schema";
import { UserDocument } from "src/modules/user/types";

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
    CREATE_MESSAGE = 'feed.create.message',
    EDIT_MESSAGE = 'feed.edit.message',
    DELETE_MESSAGE = 'feed.delete.message',
    CREATE_CONVERSATION = 'feed.create.conversation',
    DELETE_CONVERSATION = 'feed.delete.conversation',
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
    recipient: Pick<UserDocument, 'name' | 'email' | '_id'>;
    lastMessageSentAt: Date;
}

export interface ConversationDeleteParams {
    initiatorId: string;
    recipientId: string;
    conversationId: string;
}