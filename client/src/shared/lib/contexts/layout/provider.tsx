import { useLayout } from '../../hooks/useLayout';
import { ModalProvider } from '../modal/provider';
import { LayoutContext } from './context';

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <LayoutContext.Provider value={useLayout()}>
            <ModalProvider>{children}</ModalProvider>
        </LayoutContext.Provider>
    );
};