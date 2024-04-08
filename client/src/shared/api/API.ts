import { APIData, BaseAPI } from "../model/types";

export class API {
    protected readonly _baseUrl: string;
    protected readonly _serverUrl?: string;
    protected readonly _headers: BaseAPI["headers"];

    constructor({ baseUrl, headers, serverUrl }: BaseAPI) {
        this._baseUrl = baseUrl;
        this._headers = headers;
        this._serverUrl = serverUrl;
    }

    protected async _checkResponse<T>(response: Response): Promise<APIData<T>> {
        const data = await response.json();
        
        if (!response.ok) throw { ...data, message: data.message ?? "Произошла непредвиденная ошибка" };

        return {
            data,
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries([...response.headers.entries()]),
            message: data.message ?? "Успех",
        };
    }
}