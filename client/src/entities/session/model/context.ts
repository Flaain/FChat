import React from "react";
import { SessionContextProps } from "./types";

export const SessionContext = React.createContext<SessionContextProps>({
    accessToken: undefined,
    isAuthInProgress: true,
    isAuthorized: false,
    userId: undefined,
    setAccessToken: () => {},
    setIsAuthorized: () => {},
    setIsAuthInProgress: () => {},
    setUserId: () => {},
});