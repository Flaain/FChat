import { IMessage } from '../model/types';
import { API } from './API';

export class MessageAPI extends API {
    send = async ({ message, recipientId }: { message: string; recipientId: string }) => {
        const response = await fetch(this._baseUrl + `/message/send/${recipientId}`, {
            method: 'POST',
            headers: this._headers,
            credentials: this._cretedentials,
            body: JSON.stringify({ message })
        });

        return this._checkResponse<IMessage & { conversationId: string }>(response);
    };

    edit = async ({ messageId, ...body }: { message: string; messageId: string; recipientId: string }) => {
        const response = await fetch(this._baseUrl + `/message/edit/${messageId}`, {
            method: 'PATCH',
            headers: this._headers,
            credentials: this._cretedentials,
            body: JSON.stringify(body)
        });

        return this._checkResponse<IMessage>(response);
    };

    delete = async ({ messageId, ...body }: { messageId: string; conversationId: string; recipientId: string }) => {
        const response = await fetch(this._baseUrl + `/message/delete/${messageId}`, {
            method: 'DELETE',
            headers: this._headers,
            credentials: this._cretedentials,
            body: JSON.stringify(body)
        });

        return this._checkResponse<{ isLastMessage: boolean; lastMessage: IMessage; lastMessageSentAt: string }>(response);
    };
}
