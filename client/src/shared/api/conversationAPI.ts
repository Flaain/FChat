import { APIMethodParams, Conversation, Meta, WithRequired } from '../model/types';
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
        body: { conversationId, page, limit },
        ...rest
    }: WithRequired<APIMethodParams<{ conversationId: string, page?: number, limit?: number }>, 'token' | 'body'>) => {
        const response = await fetch(this._baseUrl + `/conversation/${conversationId}?page=${page}?limit=${limit}`, {
            headers: { ...this._headers, Authorization: `Bearer ${token}` },
            ...rest
        });

        return this._checkResponse<{ conversation: Conversation, meta: Meta }>(response);
    };
}
