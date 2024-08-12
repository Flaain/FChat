import { SigninStages } from "@/features/Signin/model/types";

export interface SigninContextProps {
    stage: SigninStages,
    setStage: React.Dispatch<React.SetStateAction<SigninStages>>,
}