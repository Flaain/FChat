import { SigninStages } from '@/features/Signin/model/types';

export interface ISigninContext {
    stage: SigninStages;
    setStage: (stage: SigninStages) => void;
}