import React from "react";
import { SessionContextProps } from "./types";

export const SessionContext = React.createContext<SessionContextProps>({
    state: undefined!,
    dispatch: () => {},
});