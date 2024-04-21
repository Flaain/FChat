import { APIData, BaseAPI } from "../model/types";

export abstract class API {
    protected readonly _baseUrl: string;
    protected readonly _headers: BaseAPI["headers"];

    constructor({
        baseUrl = import.meta.env.VITE_BASE_URL,
        headers = { "Content-Type": "application/json" },
    }: BaseAPI = {}) {
        this._baseUrl = baseUrl;
        this._headers = headers;
    }

    protected async _checkResponse<T>(response: Response): Promise<APIData<T>> {
        const data = await response.json();

        if (!response.ok) throw { ...data, message: data.message ?? "Something went wrong" };

        return {
            data,
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries([...response.headers.entries()]),
            message: data.message ?? "success",
        };
    }
}