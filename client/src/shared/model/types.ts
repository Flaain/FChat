export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export interface BaseAPI {
    baseUrl: string;
    serverUrl?: string;
    headers: {
        "Content-Type"?: "application/json" | (string & object);
        Authorization?: "Bearer" | (string & object);
    };
}

export interface APIData<T> {
    data: T;
    status: Response["status"];
    statusText: Response["statusText"];
    headers: Record<string, string>;
    error?: unknown;
    message: string;
}

export interface APIMethodParams extends Partial<Omit<BaseAPI, "baseUrl">>, Omit<RequestInit, "headers"> {
    endpoint?: string;
    token?: string;
}

export interface APIError<T> {
    status: number;
    message: string;
    error: T;
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