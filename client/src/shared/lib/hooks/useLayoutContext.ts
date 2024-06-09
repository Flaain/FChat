import React from "react";
import { LayoutContext } from "../contexts/layout/context";

export const useLayoutContext = () => React.useContext(LayoutContext)