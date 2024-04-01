export interface SessionContextProps {
    userId?: string;
    accessToken?: string;
    isAuthorized: boolean;
    isAuthInProgress: boolean;
    setUserId: React.Dispatch<React.SetStateAction<string | undefined>>;
    setAccessToken: React.Dispatch<React.SetStateAction<string | undefined>>;
    setIsAuthorized: React.Dispatch<React.SetStateAction<boolean>>;
    setIsAuthInProgress: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface SessionProviderProps {
    defaultIsAuthorized?: boolean;
    defaultIsAuthInProgress?: boolean;
    defaultAccessToken?: string;
    defaultUserId?: string;
    children: React.ReactNode;
}