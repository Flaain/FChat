import { Socket } from 'socket.io-client';

export interface SocketContextProps {
    socket: Socket | null;
    isConnected: boolean;
}