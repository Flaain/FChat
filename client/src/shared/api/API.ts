import { APIData, BaseAPI } from '../model/types';
import { AppException } from './error';

export abstract class API {
    protected readonly _baseUrl: string;
    protected readonly _headers: BaseAPI['headers'];
    protected readonly _cretedentials: BaseAPI['credentials'];

    constructor({
        baseUrl = import.meta.env.VITE_BASE_URL,
        headers = { 'Content-Type': 'application/json' },
        credentials = 'include'
    }: BaseAPI = {}) {
        this._baseUrl = baseUrl;
        this._headers = headers;
        this._cretedentials = credentials;
    }

    protected async _checkResponse<T>(response: Response): Promise<APIData<T>> {
        const data = await response.json();
        const headers = Object.fromEntries([...response.headers.entries()]);

        if (!response.ok) throw new AppException({ ...data, headers });

        return {
            data,
            headers,
            status: response.status,
            statusText: response.statusText,
            message: data.message ?? 'success'
        };
    }
}