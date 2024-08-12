import React from "react";
import { ProfileContext } from "../contexts/profile/context";

export const useProfile = () => React.useContext(ProfileContext);