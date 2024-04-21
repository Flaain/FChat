export enum Routes {
    AUTH = 'auth',
    SIGNUP = 'signup',
    CHECK_EMAIL = 'signup/check-email',
    SIGNIN = 'signin',
    ME = 'me',
    CONVERSATION = 'conversation',
    MESSAGE = 'conversation/message',
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