import { API } from './API';
import { GroupFeed, WithParams } from '../model/types';

export class GroupAPI extends API {
    getAll = async (body?: WithParams) => {
        const url = new URL(this._baseUrl + '/group');

        body?.params && Object.entries(body.params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });

        const response = await fetch(url, { headers: this._headers, credentials: this._cretedentials });

        return this._checkResponse<{ groups: Array<GroupFeed>; nextCursor: string }>(response);
    };
}