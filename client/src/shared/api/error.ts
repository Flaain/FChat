import { APIError } from "../model/types";

export class ApiError extends Error {
    readonly error: unknown;
    readonly message: string;
    readonly status: number;
    readonly headers?: Record<string, string>;
    readonly type?: string;

    constructor({ error, message, status, headers, type }: APIError<unknown>) {
        super(message);

        this.headers = headers;
        this.error = error;
        this.message = message;
        this.status = status;
        this.type = type;
    }
}