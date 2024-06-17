import { API } from './API';
import { APIMethodParams, Conversation, ConversationFeed, WithRequired } from '../model/types';

export class ConversationAPI extends API {
    create = async ({
        body,
        token,
        ...rest
    }: WithRequired<APIMethodParams<{ recipientId: string }>, 'body' | 'token'>) => {
        const response = await fetch(this._baseUrl + '/conversation/create', {
            method: 'POST',
            headers: { ...this._headers, Authorization: `Bearer ${token}` },
            body: JSON.stringify(body),
            ...rest
        });

        return this._checkResponse<Conversation>(response);
    };

    get = async ({
        token,
        body,
        ...rest
    }: WithRequired<APIMethodParams<{ recipientId: string; params?: { cursor?: string } }>, 'token' | 'body'>) => {
        const url = new URL(this._baseUrl + `/conversation/${body.recipientId}`);

        body.params && Object.entries(body.params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });

        const response = await fetch(url, {
            headers: { ...this._headers, Authorization: `Bearer ${token}` },
            ...rest
        });

        return this._checkResponse<{ conversation: Pick<Conversation, "_id" | "recipient" | "messages">; nextCursor: string }>(response);
    };

    getAll = async ({
        token,
        body,
        ...rest
    }: WithRequired<APIMethodParams<{ params?: { cursor?: string } }>, 'token'>) => {
        const url = new URL(this._baseUrl + '/conversation');

        body?.params &&
            Object.entries(body.params).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });

        const response = await fetch(url, {
            headers: { ...this._headers, Authorization: `Bearer ${token}` },
            ...rest
        });

        return this._checkResponse<{ conversations: Array<Omit<ConversationFeed, 'type'>>; nextCursor: string }>(response);
    };
}