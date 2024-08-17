import React from "react";
import { Profile, ProfileContextProps, ProfileProviderProps } from "./types";
import { ProfileContext } from "./context";
import { useSession } from "@/entities/session/lib/hooks/useSession";
import { SessionTypes } from "@/entities/session/model/types";
import { api } from "@/shared/api";

export const ProfileProvider = ({ defaultProfile, children }: ProfileProviderProps) => {
    const { dispatch } = useSession();

    const [profile, setProfile] = React.useState<Profile>(defaultProfile!);
    
    const getProfile = async () => {
        try {
            const { data: profile } = await api.user.profile();
            
            setProfile(profile);
            dispatch({ type: SessionTypes.SET_ON_AUTH, payload: { userId: profile._id } });
        } catch (error) {
            console.error(error);
        } finally {
            dispatch({ type: SessionTypes.SET_IS_AUTH_IN_PROGRESS, payload: { isAuthInProgress: false } });
        }
    }

    React.useEffect(() => { getProfile() }, []);
    
    React.useLayoutEffect(() => {
        const onRefreshError = () => {
            dispatch({ type: SessionTypes.SET_ON_LOGOUT });
            setProfile(undefined!);
        }

        api.user.subscribeRefreshError(onRefreshError);

        return () => {
            api.user.unsubscribeRefreshError(onRefreshError);
        }
    }, []);

    const value = React.useMemo<ProfileContextProps>(() => ({ profile, setProfile }), [profile, setProfile]);

    return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};
