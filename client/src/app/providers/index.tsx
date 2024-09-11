import React from 'react';
import { SocketProvider } from './socket/provider';
import { ModalProvider } from './modal/provider';

const Providers = ({ children }: { children: React.ReactNode }) => (
    <SocketProvider>
        <ModalProvider>{children}</ModalProvider>
    </SocketProvider>
);

export default Providers;