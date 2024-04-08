export interface User {
    id: string;
    name: string;
    email: string;
    birthDate: Date;
    conversations: Array<Conversation>;
    createdAt: Date;
    updatedAt: Date;
}

export interface Message {
    id: string;
    sender: Participant;
    receiver: Participant;
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