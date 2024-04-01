import React from "react";
import { ProfileContext } from "../contexts/profile/model/context";

export const useProfile = () => React.useContext(ProfileContext);