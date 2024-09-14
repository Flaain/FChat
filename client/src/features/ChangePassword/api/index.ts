import { API } from '@/shared/api/API';
import { BasicAPIResponse } from '@/shared/model/types';
import { UserPasswordParams } from '../model/types';

export class ChangePasswordAPI extends API {
    changePassword = async ({ type, ...body }: UserPasswordParams) => {
        const request: RequestInit = {
            method: 'POST',
            headers: this._headers,
            credentials: this._cretedentials,
            body: JSON.stringify(body)
        };
        
        const url = new URL(this._baseUrl + `/auth/password`);

        url.searchParams.append('type', type);

        return this._checkResponse<BasicAPIResponse>(await fetch(url, request), request);
    };
}