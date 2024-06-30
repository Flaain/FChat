import { Socket } from 'socket.io-client';

export interface SocketContextProps {
    socket: Socket | null;
    isConnected: boolean;
}

export enum SocketEvents {
    JOIN_CONVERSATION = "join.conversation",
    LEAVE_CONVERSATION = "leave.conversation",
}