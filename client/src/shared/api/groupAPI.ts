import { API } from "./API";
import { APIMethodParams, GroupFeed } from "../model/types";

export class GroupAPI extends API {
    getAll = async (config?: APIMethodParams<{ params?: { cursor?: string } }>) => {
        const url = new URL(this._baseUrl + '/group');

        config?.body?.params && Object.entries(config.body.params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });

        const response = await fetch(url, { headers: this._headers, credentials: this._cretedentials });

        return this._checkResponse<{ groups: Array<GroupFeed>; nextCursor: string }>(response);
    };
}