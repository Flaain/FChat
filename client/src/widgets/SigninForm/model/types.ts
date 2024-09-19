import { SigninStages } from '@/features/Signin/model/types';

export interface SigninStore {
    stage: SigninStages;
    setStage: (stage: SigninStages) => void;
}