import React from 'react';
import { PRESENCE, USER_EVENTS } from '@/shared/model/types';
import { Socket, io } from 'socket.io-client';
import { SocketContext } from './context';

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = React.useState<Socket>(null!);
    const [isConnected, setIsConnected] = React.useState(false);

    React.useEffect(() => {
        const socket = io(import.meta.env.VITE_BASE_URL, { withCredentials: true });

        socket.on('connect', () => {
            setIsConnected(true);
            
            socket.emit(USER_EVENTS.PRESENCE, { presence: PRESENCE.ONLINE });
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        setSocket(socket);

        return () => {
            socket.disconnect();
        };
    }, []);

    return <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>;
};