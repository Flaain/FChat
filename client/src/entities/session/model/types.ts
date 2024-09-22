export interface ParsedSession {
    ua: string;
    browser: IBrowser;
    device: IDevice;
    engine: IEngine;
    os: IOS;
    cpu: ICPU;
}

export interface IBrowser {
    name: string | undefined;
    version: string | undefined;
    major: string | undefined;
}

export interface IDevice {
    model: string | undefined;
    type: string | undefined;
    vendor: string | undefined;
}

export interface IEngine {
    name: string | undefined;
    version: string | undefined;
}

export interface IOS {
    name: string | undefined;
    version: string | undefined;
}

export interface ICPU {
    architecture: string | undefined;
}

export interface CurrentSession {
    _id: string;
    userAgent: ParsedSession;
    createdAt: string;
    expiresAt: string;
}

export interface ISessionContext {
    state: SessionState;
    dispatch: React.Dispatch<SessionAction>;
}

export interface Session {
    _id: string;
    userAgent: ParsedSession;
    createdAt: string;
    expiresAt: string;
}

export interface SessionProps {
    session: Session;
    withDropButton?: boolean;
    dropButtonDisabled?: boolean;
    onDrop?: (session: Session) => void;
}

export interface GetSessionsReturn {
    currentSession: CurrentSession;
    sessions: Array<Session>;
}

export enum SessionTypes {
    AUTH_IN_PROGRESS = 'AUTH_IN_PROGRESS',
    AUTH = 'AUTH',
    LOGOUT = 'LOGOUT'
}

export type SessionAction =
    | { type: SessionTypes.AUTH_IN_PROGRESS; payload: { isAuthInProgress: boolean } }
    | { type: SessionTypes.AUTH; payload: { userId: string } }
    | { type: SessionTypes.LOGOUT };

export interface SessionState {
    userId: string;
    isAuthorized: boolean;
    isAuthInProgress: boolean;
}