import { API } from '@/shared/api/API';
import { AppException } from '@/shared/api/error';
import { BasicAPIResponse } from '@/shared/model/types';
import { GetSessionsReturn } from '../model/types';

class SessionAPI extends API {
    logout = async () => {
        const request: RequestInit = {
            headers: this._headers,
            credentials: this._cretedentials
        };

        return this._checkResponse<BasicAPIResponse>(await fetch(this._baseUrl + '/auth/logout', request), request);
    };

    getSessions = async () => {
        const requestInit: RequestInit = {
            headers: this._headers,
            credentials: this._cretedentials
        };

        return this._checkResponse<GetSessionsReturn>(await fetch(`${this._baseUrl}/session`, requestInit), requestInit);
    };

    dropSession = async (sessionId: string) => {
        const requestInit: RequestInit = {
            method: 'DELETE',
            headers: this._headers,
            credentials: this._cretedentials
        };

        return this._checkResponse<BasicAPIResponse>(await fetch(`${this._baseUrl}/session/${sessionId}`, requestInit), requestInit);
    };

    terminateAllSessions = async () => {
        const requestInit: RequestInit = {
            method: 'DELETE',
            headers: this._headers,
            credentials: this._cretedentials
        };

        return this._checkResponse<{ acknowledged: boolean, deletedCount: number }>(await fetch(`${this._baseUrl}/session`, requestInit), requestInit);
    };

    subscribeRefreshError = (cb: (error: AppException) => void) => {
        API._refreshErrorObservers.add(cb);
    };

    unsubscribeRefreshError = (cb: (error: AppException) => void) => {
        API._refreshErrorObservers.delete(cb);
    };
}

export const sessionAPI = new SessionAPI();