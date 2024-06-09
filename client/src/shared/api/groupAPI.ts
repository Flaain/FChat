import { APIMethodParams, GroupFeed, WithRequired } from "../model/types";
import { API } from "./API";

export class GroupAPI extends API {
    getAll = async ({
        token,
        body,
        ...rest
    }: WithRequired<APIMethodParams<{ params?: { cursor?: string } }>, 'token'>) => {
        const url = new URL(this._baseUrl + '/group');

        body?.params && Object.entries(body.params).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });

        const response = await fetch(url, {
            headers: { ...this._headers, Authorization: `Bearer ${token}` },
            ...rest
        });

        return this._checkResponse<{ groups: Array<GroupFeed>; nextCursor: string }>(response);
    };
}