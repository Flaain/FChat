export interface SessionContextProps {
    state: SessionState;
    dispatch: React.Dispatch<SessionAction>;
}

export interface SessionProviderProps {
    defaultSessionState?: Partial<SessionState>;
    children: React.ReactNode;
}

export enum SessionTypes {
    SET_IS_AUTH_IN_PROGRESS = "SET_IS_AUTH_IN_PROGRESS",
    SET_ON_AUTH = "SET_ON_AUTH",
    SET_ON_LOGOUT = "SET_ON_LOGOUT",
}

export interface SessionState {
    userId?: string;
    isAuthorized: boolean;
    isAuthInProgress: boolean;
}

export type SessionAction =
    | { type: SessionTypes.SET_IS_AUTH_IN_PROGRESS; payload: { isAuthInProgress: boolean } }
    | { type: SessionTypes.SET_ON_AUTH; payload: { userId: string } }
    | { type: SessionTypes.SET_ON_LOGOUT; }