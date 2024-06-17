import React from "react";
import { SocketContextProps } from "./types";

export const SocketContext = React.createContext<SocketContextProps>({
    socket: null,
    isConnected: false
})