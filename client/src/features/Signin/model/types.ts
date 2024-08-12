import { z } from 'zod';
import { signinSchema } from './schema';
import { APIData } from '@/shared/model/types';
import { User } from '@/shared/lib/contexts/profile/types';

export type SigninStages = 'signin' | 'forgot';
export type SigininSchemaType = z.infer<typeof signinSchema>;

export interface ISigninAPI {
    signin: (body: SigininSchemaType) => Promise<APIData<User>>;
}