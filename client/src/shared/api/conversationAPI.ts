import { API } from './API';
import { APIMethodParams, Conversation, GetConversationsRes, WithRequired } from '../model/types';

export class ConversationAPI extends API {
    create = async ({ body, token, ...rest }: WithRequired<APIMethodParams<{ recipientId: string }>, 'body'>) => {
        const response = await fetch(this._baseUrl + '/conversation/create', {
            method: 'POST',
            credentials: this._cretedentials,
            headers: this._headers,
            body: JSON.stringify(body),
            ...rest
        });

        return this._checkResponse<Pick<Conversation, '_id' | 'lastMessageSentAt'>>(response);
    };

    get = async ({
        token,
        body,
        ...rest
    }: WithRequired<APIMethodParams<{ recipientId: string; params?: { cursor?: string | null } }>, 'body'>) => {
        const url = new URL(this._baseUrl + `/conversation/${body.recipientId}`);

        body.params && Object.entries(body.params).forEach(([key, value]) => {
            value && url.searchParams.append(key, value);
        });

        const response = await fetch(url, { headers: this._headers, credentials: this._cretedentials, ...rest });

        return this._checkResponse<{
            conversation: Pick<Conversation, '_id' | 'recipient' | 'messages' | 'createdAt'>;
            nextCursor: string;
        }>(response);
    };

    getAll = async (config?: APIMethodParams<{ params?: { cursor: string } }>) => {
        const url = new URL(this._baseUrl + '/conversation');

        config?.body?.params && Object.entries(config.body.params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });

        const response = await fetch(url, { headers: this._headers, credentials: this._cretedentials });

        return this._checkResponse<GetConversationsRes>(response);
    };
}