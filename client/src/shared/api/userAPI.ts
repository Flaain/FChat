import { API } from './API';
import { Profile, User } from '../lib/contexts/profile/model/types';
import { SigininSchemaType, SignupSchemaType } from '@/pages/Auth/model/types';
import { BasicAPIResponse, SearchUser, UserCheckParams, UserPasswordParams } from '../model/types';
import { AppException } from './error';

export class UserAPI extends API {
    check = async (body: UserCheckParams) => {
        const url = new URL(this._baseUrl + '/user/check');

        Object.entries(body).forEach(([key, value]) => {
            url.searchParams.append(key, value.trim());
        });

        const request: RequestInit = { headers: this._headers };

        return this._checkResponse<BasicAPIResponse>(await fetch(url, request), request);
    };

    password = async ({ type, ...body }: UserPasswordParams) => {
        const request: RequestInit = {
            method: 'POST',
            headers: this._headers,
            credentials: this._cretedentials,
            body: JSON.stringify(body)
        }
        const url = new URL(this._baseUrl + `/user/password`);

        url.searchParams.append('type', type);

        return this._checkResponse<BasicAPIResponse>(await fetch(url, request), request);
    }

    signup = async (body: Omit<SignupSchemaType, 'confirmPassword'>) => {
        const request: RequestInit = {
            method: 'POST',
            headers: this._headers,
            credentials: this._cretedentials,
            body: JSON.stringify(body)
        };

        return this._checkResponse<User>(await fetch(this._baseUrl + '/auth/signup', request), request);
    };

    signin = async (body: SigininSchemaType) => {
        const request: RequestInit = {
            method: 'POST',
            headers: this._headers,
            credentials: this._cretedentials,
            body: JSON.stringify(body)
        };

        return this._checkResponse<User>(await fetch(this._baseUrl + '/auth/signin', request), request);
    };

    profile = async () => {
        const request: RequestInit = {
            headers: this._headers,
            credentials: this._cretedentials
        };

        return this._checkResponse<Profile>(await fetch(this._baseUrl + '/auth/me', request), request);
    };

    logout = async () => {
        const request: RequestInit = {
            headers: this._headers,
            credentials: this._cretedentials
        };

        return this._checkResponse<BasicAPIResponse>(await fetch(this._baseUrl + '/auth/logout', request), request);
    };

    subscribeRefreshError = (cb: (error: AppException) => void) => {
        this._refreshErrorObservers.add(cb);
    }

    unsubscribeRefreshError = (cb: (error: AppException) => void) => {
        this._refreshErrorObservers.delete(cb);
    }

    search = async ({ query, page = 0, limit = 10 }: { query: string; page?: number; limit?: number }) => {
        const url = new URL(this._baseUrl + '/user/search');
        const request: RequestInit = { headers: this._headers, credentials: this._cretedentials };

        url.searchParams.append('query', query);
        url.searchParams.append('page', page.toString());
        url.searchParams.append('limit', limit.toString());

        return this._checkResponse<Array<SearchUser>>(await fetch(url, request), request);
    };

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