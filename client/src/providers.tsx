import { ProfileProvider } from './entities/profile';
import { ThemeProvider } from './entities/theme/model/provider';
import { ModalProvider } from './shared/lib/providers/modal';

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider>
            <ProfileProvider>
                <ModalProvider>{children}</ModalProvider>
            </ProfileProvider>
        </ThemeProvider>
    );
};