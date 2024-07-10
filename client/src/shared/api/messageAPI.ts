import { APIMethodParams, IMessage, WithRequired } from '../model/types';
import { API } from './API';

export class MessageAPI extends API {
    send = async ({
        body,
        token,
        ...rest
    }: WithRequired<APIMethodParams<{ message: string; recipientId: string }>, 'body' | 'token'>) => {
        const response = await fetch(this._baseUrl + `/message/send/${body.recipientId}`, {
            method: 'POST',
            headers: { ...this._headers, Authorization: `Bearer ${token}` },
            body: JSON.stringify(body),
            ...rest
        });

        return this._checkResponse<IMessage & { conversationId: string }>(response);
    };

    edit = async ({
        body: { messageId, ...body },
        token,
        ...rest
    }: WithRequired<APIMethodParams<{ message: string; messageId: string, recipientId: string }>, 'body' | 'token'>) => {
        const response = await fetch(this._baseUrl + `/message/edit/${messageId}`, {
            method: 'PATCH',
            headers: { ...this._headers, Authorization: `Bearer ${token}` },
            body: JSON.stringify(body),
            ...rest
        });

        return this._checkResponse<IMessage>(response);
    };

    delete = async ({
        body: { conversationId, messageId },
        token,
        ...rest
    }: WithRequired<APIMethodParams<{ messageId: string; conversationId: string }>, 'body' | 'token'>) => {
        const response = await fetch(this._baseUrl + `/message/delete/${messageId}`, {
            method: 'DELETE',
            headers: { ...this._headers, Authorization: `Bearer ${token}` },
            body: JSON.stringify({ conversationId }),
            ...rest
        });

        return this._checkResponse<{ isLastMessage: boolean; lastMessage: IMessage; lastMessageSentAt: string }>(response);
    };
}