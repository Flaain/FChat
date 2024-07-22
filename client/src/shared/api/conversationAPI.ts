import { API } from './API';
import { Conversation, GetConversationsRes, WithParams } from '../model/types';

export class ConversationAPI extends API {
    create = async (body: { recipientId: string }) => {
        const response = await fetch(this._baseUrl + '/conversation/create', {
            method: 'POST',
            credentials: this._cretedentials,
            headers: this._headers,
            body: JSON.stringify(body),
        });

        return this._checkResponse<Pick<Conversation, '_id' | 'lastMessageSentAt'>>(response);
    };

    get = async (body: WithParams<{ recipientId: string }>) => {
        const url = new URL(this._baseUrl + `/conversation/${body.recipientId}`);

        body.params && Object.entries(body.params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });

        const response = await fetch(url, { headers: this._headers, credentials: this._cretedentials });

        return this._checkResponse<{ conversation: Pick<Conversation, '_id' | 'recipient' | 'messages' | 'createdAt'>; nextCursor: string }>(response);
    };

    getAll = async (body?: WithParams) => {
        const url = new URL(this._baseUrl + '/conversation');

        body?.params && Object.entries(body.params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });

        const response = await fetch(url, { headers: this._headers, credentials: this._cretedentials });

        return this._checkResponse<GetConversationsRes>(response);
    };
}