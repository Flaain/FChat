import { API } from './API';
import { DeleteMessageRes, IMessage } from '../model/types';

export class MessageAPI extends API {
    send = async ({ message, recipientId }: { message: string; recipientId: string }) => {
        const request: RequestInit = {
            method: 'POST',
            headers: this._headers,
            credentials: this._cretedentials,
            body: JSON.stringify({ message, recipientId })
        }

        return this._checkResponse<IMessage>(await fetch(this._baseUrl + `/message/send/${recipientId}`, request), request);
    };

    edit = async ({ messageId, ...body }: { message: string; messageId: string; recipientId: string }) => {
        const request: RequestInit = {
            method: 'PATCH',
            headers: this._headers,
            credentials: this._cretedentials,
            body: JSON.stringify(body)
        }

        return this._checkResponse<IMessage>(await fetch(this._baseUrl + `/message/edit/${messageId}`, request), request);
    };

    reply = async ({ messageId, ...body }: { message: string; messageId: string; recipientId: string }) => {
        const request: RequestInit = {
            method: 'POST',
            headers: this._headers,
            credentials: this._cretedentials,
            body: JSON.stringify(body)
        }

        return this._checkResponse<IMessage>(await fetch(this._baseUrl + `/message/reply/${messageId}`, request), request);
    };

    delete = async ({ messageId, ...body }: { messageId: string; recipientId: string; }) => {
        const request: RequestInit = {
            method: 'DELETE',
            headers: this._headers,
            credentials: this._cretedentials,
            body: JSON.stringify(body)
        };

        return this._checkResponse<DeleteMessageRes>(await fetch(this._baseUrl + `/message/delete/${messageId}`, request), request);
    };
}
