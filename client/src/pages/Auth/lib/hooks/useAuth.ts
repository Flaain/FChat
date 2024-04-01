import React from "react";
import { AuthContext } from "../../model/context";

export const useAuth = () => React.useContext(AuthContext);