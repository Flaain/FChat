import { z } from 'zod';
import { loginForSchema, passwordForSchema } from '@/shared/constants';

export const signinSchema = z.strictObject({
    login: loginForSchema,
    password: passwordForSchema
});