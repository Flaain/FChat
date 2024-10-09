import { z } from 'zod';
import { signinSchema } from './schema';
import { APIData, Profile } from '@/shared/model/types';

export type SigninStage = 'signin' | 'forgot';
export type SigininSchemaType = z.infer<typeof signinSchema>;

export interface ISigninAPI {
    signin: (body: SigininSchemaType) => Promise<APIData<Profile>>;
}