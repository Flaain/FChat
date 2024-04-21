import { z } from 'zod';
import { emailForAuthSchema, nameForAuthSchema } from '../auth.constants';

export const signinRequestSchema = z.object({
    email: emailForAuthSchema,
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters long')
        .max(32, 'Password must be at most 32 characters long'),
});