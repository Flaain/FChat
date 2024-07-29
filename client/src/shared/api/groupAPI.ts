import { API } from './API';
import { GroupFeed, WithParams } from '../model/types';

export class GroupAPI extends API {
    getAll = async (body?: WithParams) => {
        const url = new URL(this._baseUrl + '/group');
        const request: RequestInit = { credentials: this._cretedentials, headers: this._headers };

        body?.params && Object.entries(body.params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });

        return this._checkResponse<{ groups: Array<GroupFeed>; nextCursor: string }>(await fetch(url, request), request);
    };
}