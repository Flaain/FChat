import { APIData, BaseAPI } from "../model/types";
import { ApiError } from "./error";

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
        const headers = Object.fromEntries([...response.headers.entries()]);

        if (!response.ok) throw new ApiError({ message: "Something went wrong", error: data.errors || data.error, ...data });

        return {
            data,
            headers,
            status: response.status,
            statusText: response.statusText,
            message: data.message ?? "success",
        };
    }
}