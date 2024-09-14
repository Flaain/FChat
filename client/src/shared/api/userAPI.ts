import { API } from './API';
import { BasicAPIResponse, SearchUser } from '../model/types';

export class UserAPI extends API {
    search = async ({ query, page = 0, limit = 10 }: { query: string; page?: number; limit?: number }) => {
        const url = new URL(this._baseUrl + '/user/search');
        const request: RequestInit = { headers: this._headers, credentials: this._cretedentials };

        url.searchParams.append('query', query);
        url.searchParams.append('page', page.toString());
        url.searchParams.append('limit', limit.toString());

        return this._checkResponse<Array<SearchUser>>(await fetch(url, request), request);
    };

    block = async ({ recipientId }: { recipientId: string }) => {
        const request: RequestInit = { 
            method: 'POST', 
            headers: this._headers, 
            credentials: this._cretedentials,
        };

        return this._checkResponse<BasicAPIResponse>(await fetch(this._baseUrl + `/user/block/${recipientId}`, request), request);
    }

    unblock = async ({ recipientId }: { recipientId: string }) => {
        const request: RequestInit = { 
            method: 'POST', 
            headers: this._headers, 
            credentials: this._cretedentials,
        };

        return this._checkResponse<BasicAPIResponse>(await fetch(this._baseUrl + `/user/unblock/${recipientId}`, request), request);
    }
}