import React from 'react';
import { ISocketContext } from './types';

export const SocketContext = React.createContext<ISocketContext>({
    socket: null!,
    isConnected: false
});

export const useSocket = () => React.useContext(SocketContext);