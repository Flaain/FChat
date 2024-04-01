import React from "react";
import { AuthContextProps, AuthProviderProps, AuthStage } from "./types";
import { AuthContext } from "./context";

export const AuthProvider = ({ defaultStage = "welcome", children }: AuthProviderProps) => {
    const [authStage, setAuthStage] = React.useState<AuthStage>(defaultStage);

    const value = React.useMemo<AuthContextProps>(() => ({
        authStage,
        setAuthStage,
    }), [authStage]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};