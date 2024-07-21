import { APIMethodParams, IMessage, WithRequired } from '../model/types';
import { API } from './API';

export class MessageAPI extends API {
    send = async ({ body }: WithRequired<APIMethodParams<{ message: string; recipientId: string }>, 'body'>) => {
        const response = await fetch(this._baseUrl + `/message/send/${body.recipientId}`, {
            method: 'POST',
            headers: this._headers,
            credentials: this._cretedentials,
            body: JSON.stringify(body),
        });

        return this._checkResponse<IMessage & { conversationId: string }>(response);
    };

    edit = async ({ body: { messageId, ...body } }: WithRequired<APIMethodParams<{ message: string; messageId: string, recipientId: string }>, 'body'>) => {
        const response = await fetch(this._baseUrl + `/message/edit/${messageId}`, {
            method: 'PATCH',
            headers: this._headers,
            credentials: this._cretedentials,
            body: JSON.stringify(body),
        });

        return this._checkResponse<IMessage>(response);
    };

    delete = async ({ body: { messageId, ...body } }: WithRequired<APIMethodParams<{ messageId: string; conversationId: string, recipientId: string }>, 'body'>) => {
        const response = await fetch(this._baseUrl + `/message/delete/${messageId}`, {
            method: 'DELETE',
            headers: this._headers,
            credentials: this._cretedentials,
            body: JSON.stringify(body),
        });

        return this._checkResponse<{ isLastMessage: boolean; lastMessage: IMessage; lastMessageSentAt: string }>(response);
    };
}