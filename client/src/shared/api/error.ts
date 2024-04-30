import { APIError } from "../model/types";

export class ApiError<T> extends Error {
    readonly message: string;
    readonly error: T;
    readonly status: number;
    readonly type?: string;

    constructor({ error, message, status, type }: APIError<T>) {
        super(message);

        this.error = error;
        this.message = message;
        this.status = status;
        this.type = type;
    }
}