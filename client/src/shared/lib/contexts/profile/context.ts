import React from "react";
import { ProfileContextProps } from "./types";

export const ProfileContext = React.createContext<ProfileContextProps>({
    profile: undefined!,
    setProfile: () => {},
});