import { SigninStage } from '@/features/Signin/model/types';

export interface SigninStore {
    stage: SigninStage;
    changeSigninStage: (stage: SigninStage) => void;
}