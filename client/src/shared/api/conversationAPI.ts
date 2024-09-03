import { API } from './API';
import { Conversation, GetConversation, IMessage, WithParams, WithRequired } from '../model/types';

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

    get = async (body: Omit<WithParams<{ recipientId: string }>, 'params'>) => {
        const url = new URL(this._baseUrl + `/conversation/${body.recipientId}`);
        const request: RequestInit = { credentials: this._cretedentials, headers: this._headers, signal: body.signal };

        return this._checkResponse<GetConversation>(await fetch(url, request), request);
    };

    getPreviousMessages = async (body: WithRequired<WithParams<{ recipientId: string }>, 'params'>) => {
        const url = new URL(this._baseUrl + `/conversation/previous-messages/${body.recipientId}`);
        const request: RequestInit = { credentials: this._cretedentials, headers: this._headers, signal: body.signal };

        body.params && Object.entries(body.params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });

        return this._checkResponse<{ messages: Array<IMessage>, nextCursor: string | null }>(await fetch(url, request), request);
    };

    delete = async (recipientId: string) => {
        const request: RequestInit = {
            method: 'DELETE',
            credentials: this._cretedentials,
            headers: this._headers,
        };

        return this._checkResponse<{ conversationId: string }>(await fetch(this._baseUrl + `/conversation/delete/${recipientId}`, request), request);
    };
}