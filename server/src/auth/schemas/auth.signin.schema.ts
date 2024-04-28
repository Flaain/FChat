import { emailForSchema } from 'src/utils/constants';
import { z } from 'zod';

export const signinRequestSchema = z.object({
    email: emailForSchema,
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters long')
        .max(32, 'Password must be at most 32 characters long'),
});