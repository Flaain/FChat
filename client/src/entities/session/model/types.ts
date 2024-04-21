export interface SessionContextProps {
    state: SessionState;
    dispatch: React.Dispatch<SessionAction>;
}

export interface SessionProviderProps {
    defaultSessionState?: Partial<SessionState>;
    children: React.ReactNode;
}

export enum SessionTypes {
    SET_USER_ID = "SET_USER_ID",
    SET_ACCESS_TOKEN = "SET_ACCESS_TOKEN",
    SET_IS_AUTHORIZED = "SET_IS_AUTHORIZED",
    SET_IS_AUTH_IN_PROGRESS = "SET_IS_AUTH_IN_PROGRESS",
    SET_AUTH_DONE = "SET_AUTH_DONE",
    SET_ON_AUTH = "SET_ON_AUTH",
    SET_ON_LOGOUT = "SET_ON_LOGOUT",
}

export interface SessionState {
    userId?: string;
    accessToken?: string;
    expiresIn?: string | number;
    isAuthorized: boolean;
    isAuthInProgress: boolean;
}

export type SessionAction =
    | { type: SessionTypes.SET_USER_ID; payload: { userId: string } }
    | { type: SessionTypes.SET_ACCESS_TOKEN; payload: { accessToken: string } }
    | { type: SessionTypes.SET_IS_AUTHORIZED; payload: { isAuthorized: boolean } }
    | { type: SessionTypes.SET_IS_AUTH_IN_PROGRESS; payload: { isAuthInProgress: boolean } }
    | { type: SessionTypes.SET_ON_AUTH; payload: { isAuthorized: boolean; accessToken: string, userId: string, expiresIn: string | number } }
    | { type: SessionTypes.SET_AUTH_DONE; payload: { isAuthorized: boolean; userId: string } }
    | { type: SessionTypes.SET_ON_LOGOUT; payload: { isAuthorized: boolean } }