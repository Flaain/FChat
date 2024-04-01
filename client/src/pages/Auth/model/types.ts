export type AuthStage = "welcome" | "signIn" | "signUp";

export interface AuthContextProps {
    authStage: AuthStage;
    setAuthStage: React.Dispatch<React.SetStateAction<AuthStage>>;
}

export interface AuthProviderProps {
    defaultStage?: AuthStage;
    children: React.ReactNode;
}