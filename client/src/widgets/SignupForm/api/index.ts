import { API } from '@/shared/api/API';
import { ISignupAPI, SignupSchemaType } from '../model/types';
import { User } from '@/shared/lib/contexts/profile/types';
import { BasicAPIResponse, UserCheckParams } from '@/shared/model/types';

export class SignupAPI extends API implements ISignupAPI {
    signup = async (body: Omit<SignupSchemaType, 'confirmPassword'>) => {
        const request: RequestInit = {
            method: 'POST',
            headers: this._headers,
            credentials: this._cretedentials,
            body: JSON.stringify(body)
        };

        return this._checkResponse<User>(await fetch(this._baseUrl + '/auth/signup', request), request);
    };

    check = async (body: UserCheckParams) => {
        const url = new URL(this._baseUrl + '/user/check');

        Object.entries(body).forEach(([key, value]) => {
            url.searchParams.append(key, value.trim());
        });

        const request: RequestInit = { headers: this._headers };

        return this._checkResponse<BasicAPIResponse>(await fetch(url, request), request);
    };
}

export const signupAPI = new SignupAPI();