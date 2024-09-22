import { z } from "zod";
import { signupSchema } from "./schema";
import { UseFormReturn } from "react-hook-form";
import { APIData, BasicAPIResponse, Profile, UserCheckParams } from "@/shared/model/types";

export type SignupSchemaType = z.infer<typeof signupSchema>;

export interface ISignupAPI {
    signup: (body: Omit<SignupSchemaType, 'confirmPassword'> & { otp: string }) => Promise<APIData<Profile>>;
    check: (body: UserCheckParams) => Promise<APIData<BasicAPIResponse>>;
}

export interface ISignupContext {
    step: number;
    loading: boolean;
    isLastStep: boolean;
    form: UseFormReturn<SignupSchemaType>;
    isNextButtonDisabled: boolean;
    onSubmit: (event?: React.FormEvent<HTMLFormElement>) => void;
    onBack: () => void;
}