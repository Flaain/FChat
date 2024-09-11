import { API } from '@/shared/api/API';
import { Profile } from '../model/types';

export class ProfileApi extends API {
    getProfile = async () => {
        const request: RequestInit = {
            headers: this._headers,
            credentials: this._cretedentials
        };

        return this._checkResponse<Profile>(await fetch(this._baseUrl + '/auth/me', request), request);
    };
}

export const profileApi = new ProfileApi();