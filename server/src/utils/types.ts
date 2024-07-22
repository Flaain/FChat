import { UserDocument } from "src/modules/user/types";

export type RequestWithUser = Request & { user: UserDocument };

export enum Routes {
    AUTH = 'auth',
    USER = "user",
    GROUP = "group",
    FEED = 'feed',
    SESSION = 'session',
    CONVERSATION = 'conversation',
    PARTICIPANT = 'participant',
    MESSAGE = 'message',
    OTP = 'auth/otp',
}

export enum AppExceptionCode {
    INVALID_ACCESS_TOKEN = 'INVALID_ACCESS_TOKEN',
    FORM = "FORM"
}

export interface IAppException {
    message: string;
    url?: string;
    timestamp?: Date;
    errors?: Array<{ path: string, message: string }>;
    errorCode?: AppExceptionCode;
}

export enum JWT_KEYS {
    ACCESS_TOKEN_SECRET = 'ACCESS_TOKEN_SECRET',
    ACCESS_TOKEN_EXPIRESIN = 'ACCESS_TOKEN_EXPIRESIN',
    REFRESH_TOKEN_SECRET = 'REFRESH_TOKEN_SECRET',
    REFRESH_TOKEN_EXPIRESIN = 'REFRESH_TOKEN_EXPIRESIN',
}

export enum ConversationType {
    GROUP = 'group',
    PRIVATE = 'private',
}

export interface Message {
    id: string;
    sender: Participant;
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