import React from "react";
import { SigninContextProps } from "./types";

export const SigninContext = React.createContext<SigninContextProps>({
    stage: 'signin',
    setStage: () => {},
})