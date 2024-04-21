import { z } from "zod";
import { signinRequestSchema } from "../schemas/auth.signin.schema";
import { User } from "src/user/types";
import { meRequestSchema } from "../schemas/auth.me.schema";
import { signupSchema } from "../schemas/auth.signup.schema";

export type SigninRequest = z.infer<typeof signinRequestSchema>;
export type SignupRequest = Omit<z.infer<typeof signupSchema>, "confirmPassword">;
export type MeRequest = z.infer<typeof meRequestSchema>;

export interface AuthResponse extends User {
    accessToken: string;
    expiersIn: string;
}