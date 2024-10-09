import { API } from "@/shared/api/API";
import { DefaultParamsAPI, DeleteMessageRes, Message } from "../model/types";

class MessageApi extends API {
    send = async <T = Message>({ query, body }: DefaultParamsAPI) => {
        const request: RequestInit = {
            body,
            method: 'POST',
            headers: this._headers,
            credentials: this._cretedentials,
        }

        return this._checkResponse<T>(await fetch(this._baseUrl + query, request), request);
    };

    edit = async <T = Message>({ query, body }: DefaultParamsAPI) => {
        const request: RequestInit = {
            body,
            method: 'PATCH',
            headers: this._headers,
            credentials: this._cretedentials
        }

        return this._checkResponse<T>(await fetch(this._baseUrl + query, request), request);
    };

    reply = async <T = Message>({ query, body }: DefaultParamsAPI) => {
        const request: RequestInit = {
            body,
            method: 'POST',
            headers: this._headers,
            credentials: this._cretedentials
        }

        return this._checkResponse<T>(await fetch(this._baseUrl + query, request), request);
    };

    delete = async <T = DeleteMessageRes>({ query, body }: DefaultParamsAPI) => {
        const request: RequestInit = {
            body,
            method: 'DELETE',
            headers: this._headers,
            credentials: this._cretedentials,
        };

        return this._checkResponse<T>(await fetch(this._baseUrl + query, request), request);
    };
}

export const messageAPI = new MessageApi();