import React from "react";
import { SessionContext } from "../../model/context";

export const useSession = () => React.useContext(SessionContext);