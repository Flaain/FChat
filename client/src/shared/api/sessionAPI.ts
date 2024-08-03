import { API } from './API';
import { GetSessionsReturn } from '../model/types';

export class SessionAPI extends API {
    getSessions = async () => {
        const requestInit: RequestInit = {
            headers: this._headers,
            credentials: this._cretedentials
        };

        return this._checkResponse<GetSessionsReturn>(await fetch(`${this._baseUrl}/session`, requestInit), requestInit);
    };
}