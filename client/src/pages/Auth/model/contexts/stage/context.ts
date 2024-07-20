import React from "react";
import { AuthContextProps } from "../../types";

export const AuthContext = React.createContext<AuthContextProps>({
    authStage: "welcome",
    setAuthStage: () => {},
});