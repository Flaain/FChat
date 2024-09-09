import { SessionProvider } from './entities/session/model/provider';
import { SessionProviderProps } from './entities/session/model/types';
import { ThemeProvider } from './entities/theme/model/provider';
import { ThemeProviderProps } from './entities/theme/model/types';
import { DomEventsProvider } from './shared/lib/contexts/domEvents/provider';
import { ProfileProvider } from './shared/lib/contexts/profile/provider';
import { ProfileProviderProps } from './shared/lib/contexts/profile/types';

export interface ProvidersProps {
    theme: Omit<ThemeProviderProps, 'children'>;
    profile?: Omit<ProfileProviderProps, 'children'>;
    session?: Omit<SessionProviderProps, 'children'>;
    children: React.ReactNode;
}

const Providers = ({ profile, session, theme, children }: ProvidersProps) => {
    return (
        <DomEventsProvider>
            <ThemeProvider {...theme}>
                <SessionProvider {...session}>
                    <ProfileProvider {...profile}>{children}</ProfileProvider>
                </SessionProvider>
            </ThemeProvider>
        </DomEventsProvider>
    );
};

export default Providers;