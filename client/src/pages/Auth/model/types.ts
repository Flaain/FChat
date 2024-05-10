import { z } from "zod";
import { signinSchema, signupSchema } from "./schema";

export type AuthStage = "welcome" | "signIn" | "signUp";
export type SignupSchemaType = z.infer<typeof signupSchema>;
export type SigininSchemaType = z.infer<typeof signinSchema>;

export interface AuthContextProps {
    authStage: AuthStage;
    setAuthStage: React.Dispatch<React.SetStateAction<AuthStage>>;
}

export interface AuthProviderProps {
    defaultStage?: AuthStage;
    children: React.ReactNode;
}