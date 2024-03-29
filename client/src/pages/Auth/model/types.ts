export type AuthForm = "welcome" | "signIn" | "signUp";

export interface AuthInitialState {
    form: AuthForm;
}