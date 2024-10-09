export type AuthStage = 'welcome' | 'signIn' | 'signUp';

export interface AuthStore {
    authStage: AuthStage;
    changeAuthStage: (stage: AuthStage) => void;
}