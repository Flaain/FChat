import React from "react";
import { DomEventsContext } from "../contexts/domEvents/context";

export const useDomEvents = () => React.useContext(DomEventsContext);