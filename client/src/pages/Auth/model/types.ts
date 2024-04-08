import { z } from "zod";
import { signupSchema } from "./schema";

export type AuthStage = "welcome" | "signIn" | "signUp";
export type SignupSchema = z.infer<typeof signupSchema>;

export interface AuthContextProps {
    authStage: AuthStage;
    setAuthStage: React.Dispatch<React.SetStateAction<AuthStage>>;
}

export interface AuthProviderProps {
    defaultStage?: AuthStage;
    children: React.ReactNode;
}