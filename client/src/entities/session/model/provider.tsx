import React from "react";
import { SessionContextProps, SessionProviderProps } from "./types";
import { SessionContext } from "./context";

export const SessionProvider = ({
    defaultUserId,
    defaultAccessToken,
    defaultIsAuthInProgress = true,
    defaultIsAuthorized = false,
    children,
}: SessionProviderProps) => {
    const [userId, setUserId] = React.useState(defaultUserId);
    const [accessToken, setAccessToken] = React.useState(defaultAccessToken);
    const [isAuthInProgress, setIsAuthInProgress] = React.useState(defaultIsAuthInProgress);
    const [isAuthorized, setIsAuthorized] = React.useState(defaultIsAuthorized);

    const value = React.useMemo<SessionContextProps>(() => ({
        userId,
        accessToken,
        isAuthInProgress,
        isAuthorized,
        setUserId,
        setAccessToken,
        setIsAuthInProgress,
        setIsAuthorized,
    }), [userId, accessToken, isAuthInProgress, isAuthorized]);

    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};