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

export interface SessionStore {
    userId: string;
    isAuthorized: boolean;
    isAuthInProgress: boolean;
    onAuth: (userId: string) => void;
    onLogout: () => void;
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