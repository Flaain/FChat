import React from 'react';
import { Socket, io } from 'socket.io-client';
import { SocketContext } from './context';
import { useSession } from '@/entities/session/lib/hooks/useSession';

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const { state: { accessToken } } = useSession();

    const [socket, setSocket] = React.useState<Socket | null>(null);
    const [isConnected, setIsConnected] = React.useState(false);

    React.useEffect(() => {
        const newSocket = io(import.meta.env.VITE_BASE_URL, {
            auth: {
                token: accessToken 
            }
        });

        newSocket.on('connect', () => {
            setIsConnected(true);
        });
        newSocket.on('disconnect', () => {
            setIsConnected(false);
        });

        newSocket.on('message.send', (data) => {
            console.log(data);
        })

        setSocket(newSocket);
        
        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};