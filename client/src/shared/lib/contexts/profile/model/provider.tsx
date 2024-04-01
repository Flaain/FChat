import React from "react";
import { Profile, ProfileContextProps, ProfileProviderProps } from "./types";
import { useSession } from "@/entities/session/lib/hooks/useSession";
import { ProfileContext } from "./context";

export const ProfileProvider = ({ defaultProfile, children }: ProfileProviderProps) => {
    const { setUserId, setAccessToken, setIsAuthInProgress, setIsAuthorized } = useSession();

    const [profile, setProfile] = React.useState<Profile | undefined>(defaultProfile);

    React.useEffect(() => {
        (async () => {
            if (defaultProfile) return;

            try {
                const profile = await new Promise<Profile>((resolve, reject) => {
                    setTimeout(() => {
                        reject({
                            id: window.crypto.randomUUID(),
                            username: "User",
                            email: "g7yJt@example.com",
                            conversations: [],
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        });
                    }, 5000);
                });

                setProfile(profile);
                setUserId(profile.id);
                setAccessToken(profile.id);
                setIsAuthorized(true);
            } catch (error) {
                console.error(error);
            } finally {
                setIsAuthInProgress(false);
            }
        })();
    }, [defaultProfile, setAccessToken, setIsAuthInProgress, setIsAuthorized, setUserId]);

    const value = React.useMemo<ProfileContextProps>(() => ({
        profile,
        setProfile,
    }), [profile, setProfile]);

    return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};