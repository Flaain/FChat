import React from "react";
import { AuthContext } from "../contexts/auth/context";

export const useAuth = () => React.useContext(AuthContext);