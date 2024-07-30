import React from "react";
import { Socket, io } from "socket.io-client";

export const useSocket = () => {
    const [socket, setSocket] = React.useState<Socket | null>(null);
    const [isConnected, setIsConnected] = React.useState(false);

    React.useEffect(() => {
        const socket = io(import.meta.env.VITE_BASE_URL, {
            withCredentials: true,
        });

        socket.on('connect', () => {
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        setSocket(socket);
        
        return () => {
            socket.disconnect();
        };
    }, []);

    return { socket, isConnected };
}