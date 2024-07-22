import { z } from 'zod';
import { Types } from 'mongoose';
import { signinRequestSchema } from '../schemas/auth.signin.schema';
import { signupSchema } from '../schemas/auth.signup.schema';
import { IUser, UserDocument, UserProfileType } from 'src/modules/user/types';

export type SigninRequest = z.infer<typeof signinRequestSchema> & { userAgent?: string };
export type SignupRequest = z.infer<typeof signupSchema> & { userAgent?: string };

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