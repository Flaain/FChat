import { Profile } from "../lib/contexts/profile/model/types";

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export interface BaseAPI {
    baseUrl?: string;
    headers?: {
        "Content-Type"?: "application/json" | (string & object);
        Authorization?: "Bearer" | (string & object);
    };
}

// export interface IAbstractAPI extends BaseAPI {
//    _checkResponse<T>(response: Response): Promise<APIData<T>>;
// } <-- cannot use protected so decided to comment for now

export interface APIData<T> {
    data: T;
    status: Response["status"];
    statusText: Response["statusText"];
    headers: Record<string, string>;
    error?: unknown;
    message: string;
}

export interface AuthResponse extends Profile {
    accessToken: string;
    expiresIn: string | number;
}

export interface APIMethodParams<T = undefined> extends Partial<Omit<BaseAPI, "baseUrl">>, Omit<RequestInit, "headers" | "body"> {
    endpoint?: string;
    token?: string;
    body?: T;
}

export interface APIError<T> {
    status: number;
    message: string;
    error: T;
    type?: string; 
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