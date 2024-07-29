import React from "react";
import { AuthContext } from "../../model/contexts/stage/context";

export const useAuth = () => React.useContext(AuthContext);