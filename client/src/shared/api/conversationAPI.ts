import { API } from './API';
import { Conversation, GetConversation, WithParams } from '../model/types';

export class ConversationAPI extends API {
    create = async (body: { recipientId: string }) => {
        const request: RequestInit = {
            method: 'POST',
            credentials: this._cretedentials,
            headers: this._headers,
            body: JSON.stringify(body),
        };

        return this._checkResponse<Pick<Conversation, '_id' | 'lastMessageSentAt'>>(await fetch(this._baseUrl + '/conversation/create', request), request);
    };

    get = async (body: WithParams<{ recipientId: string }>) => {
        const url = new URL(this._baseUrl + `/conversation/${body.recipientId}`);
        const request: RequestInit = { credentials: this._cretedentials, headers: this._headers, signal: body.signal };

        body.params && Object.entries(body.params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });

        return this._checkResponse<GetConversation>(await fetch(url, request), request);
    };
}