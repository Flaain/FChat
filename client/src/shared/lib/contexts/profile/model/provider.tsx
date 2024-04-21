import React from "react";
import { Profile, ProfileContextProps, ProfileProviderProps } from "./types";
import { ProfileContext } from "./context";
import { useSession } from "@/entities/session/lib/hooks/useSession";
import { SessionTypes } from "@/entities/session/model/types";
import { api } from "@/shared/api";

export const ProfileProvider = ({ defaultProfile, children }: ProfileProviderProps) => {
    const { state: { accessToken }, dispatch } = useSession();

    const [profile, setProfile] = React.useState<Profile>(defaultProfile!);

    React.useEffect(() => {
        (async () => {
            try {
                if (!accessToken) return;

                const { data: profile } = await api.user.profile({ token: accessToken });

                setProfile(profile);
                dispatch({ type: SessionTypes.SET_AUTH_DONE, payload: { userId: profile.id, isAuthorized: true } });
            } catch (error) {
                console.error(error);
                // localStorage.removeItem(localStorageKeys.TOKEN);
            } finally {
                dispatch({ type: SessionTypes.SET_IS_AUTH_IN_PROGRESS, payload: { isAuthInProgress: false } });
            }
        })();
    }, []);

    const value = React.useMemo<ProfileContextProps>(() => ({ profile, setProfile }), [profile, setProfile]);

    return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};
