import { ConversationFeed, GroupFeed, Pagination, UserFeed, WithMeta } from '../model/types';
import { API } from './API';

export class FeedAPI extends API {
    get = async () => {
        const request: RequestInit = {
            headers: this._headers,
            credentials: this._cretedentials
        };

        return this._checkResponse<{ feed: Array<ConversationFeed | GroupFeed>; nextCursor: string | null }>(await fetch(this._baseUrl + '/feed', request), request);
    };

    search = async (params: Pagination) => {
        const url = new URL(this._baseUrl + '/feed/search');

        const request: RequestInit = {
            headers: this._headers,
            credentials: this._cretedentials
        };

        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        })

        return this._checkResponse<WithMeta<Array<UserFeed | GroupFeed>>>(await fetch(url, request), request);
    }
}