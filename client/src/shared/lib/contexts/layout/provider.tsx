import { useLayout } from '../../hooks/useLayout';
import { ModalProvider } from '../modal/provider';
import { SocketProvider } from '../socket/provider';
import { LayoutContext } from './context';

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <LayoutContext.Provider value={useLayout()}>
            <SocketProvider>
                <ModalProvider>{children}</ModalProvider>
            </SocketProvider>
        </LayoutContext.Provider>
    );
};