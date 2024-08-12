import { z } from "zod";
import { signupSchema } from "./schema";
import { UseFormReturn } from "react-hook-form";
import { User } from "@/shared/lib/contexts/profile/types";
import { APIData, BasicAPIResponse, UserCheckParams } from "@/shared/model/types";

export type SignupSchemaType = z.infer<typeof signupSchema>;
export type SignupFormReturn = UseFormReturn<SignupSchemaType>;

export interface ISignupAPI {
    signup: (body: Omit<SignupSchemaType, 'confirmPassword'> & { otp: string }) => Promise<APIData<User>>;
    check: (body: UserCheckParams) => Promise<APIData<BasicAPIResponse>>;
}