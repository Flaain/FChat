import { SessionProvider } from "./entities/session/model/provider";
import { SessionProviderProps } from "./entities/session/model/types";
import { ThemeProvider } from "./entities/theme/model/provider";
import { ThemeProviderProps } from "./entities/theme/model/types";
import { ProfileProvider } from "./shared/lib/contexts/profile/model/provider";
import { ProfileProviderProps } from "./shared/lib/contexts/profile/model/types";

export interface ProvidersProps {
    profile: Omit<ProfileProviderProps, "children">;
    theme: Omit<ThemeProviderProps, "children">;
    session?: Omit<SessionProviderProps, "children">;
    children: React.ReactNode;
}

const Providers = ({ profile, session, theme, children }: ProvidersProps) => {
    return (
        <ThemeProvider {...theme}>
            <SessionProvider {...session}>
                <ProfileProvider {...profile}>{children}</ProfileProvider>
            </SessionProvider>
        </ThemeProvider>
    );
};

export default Providers;