import { z } from 'zod';
import { signinRequestSchema } from '../schemas/auth.signin.schema';
import { IUser, UserDocument, UserProfileType } from 'src/user/types';
import { meRequestSchema } from '../schemas/auth.me.schema';
import { signupSchema } from '../schemas/auth.signup.schema';
import { Types } from 'mongoose';

export type SigninRequest = z.infer<typeof signinRequestSchema>;
export type SignupRequest = z.infer<typeof signupSchema> & { userAgent?: string };
export type MeRequest = z.infer<typeof meRequestSchema>;

export interface IAuthService {
    signin(dto: SigninRequest): Promise<Omit<IUser, 'password'>>;
    signup(dto: SignupRequest): Promise<Omit<IUser, 'password'>>;
    getProfile(user: UserDocument): Promise<UserProfileType>;
    validateUser(_id: Types.ObjectId | string): Promise<UserDocument>;
    getProfile(user: UserDocument): Promise<Omit<IUser, 'accessToken' | 'expiersIn' | 'password'>>;
    _checkEmail(email: string): Promise<{ status: number; message: string }>;
    _checkName(name: string): Promise<{ status: number; message: string }>;
    _createToken(_id: string): { accessToken: string; expiersIn: string };
    _validateUserBeforeSignup(dto: SignupRequest): Promise<void>;
}