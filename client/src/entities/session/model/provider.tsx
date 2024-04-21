import React from "react";
import { SessionContextProps, SessionProviderProps } from "./types";
import { SessionContext } from "./context";
import { sessionReducer } from "./reducer";

export const SessionProvider = ({ defaultSessionState, children }: SessionProviderProps) => {
    const [state, dispatch] = React.useReducer(sessionReducer, { isAuthInProgress: true, isAuthorized: false, ...defaultSessionState });

    const value = React.useMemo<SessionContextProps>(() => ({ state, dispatch }), [state]);

    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};