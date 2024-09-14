import { API } from '@/shared/api/API';
import { Avatar, Profile } from '../model/types';
import { BasicAPIResponse } from '@/shared/model/types';

class ProfileApi extends API {
    getProfile = async () => {
        const request: RequestInit = {
            headers: this._headers,
            credentials: this._cretedentials
        };

        return this._checkResponse<Profile>(await fetch(this._baseUrl + '/auth/me', request), request);
    };

    avatar = async (form: FormData) => {
        const request: RequestInit = {
            method: 'POST',
            credentials: this._cretedentials,
            body: form
        };

        return this._checkResponse<Avatar>(await fetch(this._baseUrl + '/user/avatar', request), request);
    }

    status = async (body: { status: string }) => {
        const request: RequestInit = { 
            method: 'POST', 
            headers: this._headers, 
            credentials: this._cretedentials,
            body: JSON.stringify(body)
        };

        return this._checkResponse<BasicAPIResponse>(await fetch(this._baseUrl + `/user/status`, request), request);
    };

    name = async (body: { name: string }) => {
        const request: RequestInit = { 
            method: 'POST', 
            headers: this._headers, 
            credentials: this._cretedentials,
            body: JSON.stringify(body)
        };

        return this._checkResponse<BasicAPIResponse>(await fetch(this._baseUrl + `/user/name`, request), request);
    };
}

export const profileApi = new ProfileApi();