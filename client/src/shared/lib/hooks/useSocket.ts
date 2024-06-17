import React from "react";
import { SocketContext } from "../contexts/socket/context";

export const useSocket = () => React.useContext(SocketContext);