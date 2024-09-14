import { API } from '@/shared/api/API';
import { AppException } from '@/shared/api/error';
import { BasicAPIResponse } from '@/shared/model/types';

class SessionAPI extends API {
    logout = async () => {
        const request: RequestInit = {
            headers: this._headers,
            credentials: this._cretedentials
        };

        return this._checkResponse<BasicAPIResponse>(await fetch(this._baseUrl + '/auth/logout', request), request);
    };

    subscribeRefreshError = (cb: (error: AppException) => void) => {
        API._refreshErrorObservers.add(cb);
    };

    unsubscribeRefreshError = (cb: (error: AppException) => void) => {
        API._refreshErrorObservers.delete(cb);
    };
}

export const sessionApi = new SessionAPI();