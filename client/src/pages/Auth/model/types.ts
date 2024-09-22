export type AuthStage = 'welcome' | 'signIn' | 'signUp';

export interface IAuthContext {
    authStage: AuthStage;
    changeAuthStage: React.Dispatch<React.SetStateAction<AuthStage>>;
}