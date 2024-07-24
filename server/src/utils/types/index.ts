import { UserDocument } from "src/modules/user/types";

export type RequestWithUser = Request & { user: UserDocument };

export enum Routes {
    AUTH = 'auth',
    USER = "user",
    GROUP = "group",
    FEED = 'feed',
    SESSION = 'session',
    CONVERSATION = 'conversation',
    PARTICIPANT = 'participant',
    MESSAGE = 'message',
    OTP = 'auth/otp',
}

export enum JWT_KEYS {
    ACCESS_TOKEN_SECRET = 'ACCESS_TOKEN_SECRET',
    ACCESS_TOKEN_EXPIRESIN = 'ACCESS_TOKEN_EXPIRESIN',
    REFRESH_TOKEN_SECRET = 'REFRESH_TOKEN_SECRET',
    REFRESH_TOKEN_EXPIRESIN = 'REFRESH_TOKEN_EXPIRESIN',
}

export enum AppExceptionCode {
    INVALID_ACCESS_TOKEN = 'INVALID_ACCESS_TOKEN',
    FORM = 'FORM',
}

export interface IAppException {
    message: string;
    errors?: Array<{ path: string; message: string }>;
    errorCode?: AppExceptionCode;
}

export interface ImplementAppException {
    message: string;
    errors?: Array<{ path: string; message: string }>;
    errorCode?: AppExceptionCode;
    statusCode: number;

    getErrorCode(): AppExceptionCode;
    getStatusCode(): number;
}