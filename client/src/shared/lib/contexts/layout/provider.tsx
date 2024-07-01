import { useLayout } from '../../hooks/useLayout';
import { ModalProvider } from '../modal/provider';
import { SocketProvider } from '../socket/provider';
import { LayoutContext } from './context';

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <SocketProvider>
            <LayoutContext.Provider value={useLayout()}>
                <ModalProvider>{children}</ModalProvider>
            </LayoutContext.Provider>
        </SocketProvider>
    );
};