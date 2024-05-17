import { APIMethodParams, Conversation, WithRequired } from '../model/types';
import { API } from './API';

export class ConversationAPI extends API {
    createConversation = async ({
        body,
        token,
        ...rest
    }: WithRequired<APIMethodParams<{ participants: Array<string>; name?: string }>, 'body' | 'token'>) => {
        const response = await fetch(this._baseUrl + '/conversation/create', {
            method: 'POST',
            headers: { ...this._headers, Authorization: `Bearer ${token}` },
            body: JSON.stringify(body),
            ...rest
        });

        return this._checkResponse<Conversation>(response);
    };

    getConversation = async ({
        token,
        body,
        ...rest
    }: WithRequired<APIMethodParams<{ conversationId: string; params?: { cursor?: string } }>, 'token' | 'body'>) => {
        const url = new URL(this._baseUrl + `/conversation/${body.conversationId}`);

        body.params && Object.entries(body.params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });

        const response = await fetch(url, {
            headers: { ...this._headers, Authorization: `Bearer ${token}` },
            ...rest
        });

        return this._checkResponse<{ conversation: Conversation; nextCursor: string }>(response);
    };
}