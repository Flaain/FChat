export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    conversationId: string;
    text: string;
    createdAt: string;
    updatedAt: string;
}

export interface Conversation {
    id: string;
    participants: Array<string>;
    messages: Array<Message>;
    createdAt: string;
    updatedAt: string;
}

export interface Profile {
    id: string;
    username: string;
    email: string;
    conversations: Array<Conversation>;
    createdAt: string;
    updatedAt: string;
}