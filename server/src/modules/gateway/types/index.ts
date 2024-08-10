import { Message } from 'src/modules/message/schemas/message.schema';
import { PRESENCE, UserDocument } from 'src/modules/user/types';
import { Socket,  } from 'socket.io';
import { DefaultEventsMap  } from 'socket.io/dist/typed-events';

export enum STATIC_CONVERSATION_EVENTS {
    JOIN = 'conversation.join',
    LEAVE = 'conversation.leave',
    SEND_MESSAGE = 'conversation.message.send',
    EDIT_MESSAGE = 'conversation.message.edit',
    DELETE_MESSAGE = 'conversation.message.delete',
    CREATED = 'conversation.created',
    DELETED = 'conversation.deleted',
    PRESENCE = 'conversation.user.presence',
}

export enum USER_EVENTS {
    PRESENCE = 'user.presence',
    ONLINE = 'user.online',
    OFFLINE = 'user.offline',
}

export enum FEED_EVENTS {
    CREATE_MESSAGE = 'feed.create.message',
    EDIT_MESSAGE = 'feed.edit.message',
    DELETE_MESSAGE = 'feed.delete.message',
    CREATE_CONVERSATION = 'feed.create.conversation',
    DELETE_CONVERSATION = 'feed.delete.conversation',
    USER_ONLINE = 'feed.user.online',
    USER_OFFLINE = 'feed.user.offline',
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

export interface ConversationEditMessageParams extends ConversationSendMessageParams {
    isLastMessage: boolean;
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

export interface ChangeUserStatusParams {
    presence: PRESENCE;
    lastSeenAt?: Date;
}

export interface SocketWithUser extends Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, { user: UserDocument }> {}
