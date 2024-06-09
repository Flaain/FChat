import { UserDocument } from "src/user/types";

export type RequestWithUser = Request & { user: UserDocument };

export enum Routes {
    AUTH = 'auth',
    USER = "user",
    FEED = 'feed',
    CONVERSATION = 'conversation',
    PARTICIPANT = 'participant',
    MESSAGE = 'message',
}

export enum ConversationType {
    GROUP = 'group',
    PRIVATE = 'private',
}

export interface Message {
    id: string;
    sender: Participant;
    // receiver: Participant;
    conversationId: string;
    hasBeenRead: boolean;
    text: string;
    createdAt: string;
    updatedAt: string;
}

export interface Participant {
    id: string;
    username: string;
    createdAt: string;
    updatedAt: string;
}

export interface Conversation {
    id: string;
    name?: string;
    participants: Array<Participant>;
    messages: Array<Message>;
    createdAt: string;
    updatedAt: string;
}