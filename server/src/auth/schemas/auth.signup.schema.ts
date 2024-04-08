import { z } from 'zod';

export const signupSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email address'),
    name: z
        .string()
        .trim()
        .min(1, 'Name is required')
        .min(3, 'Name must be at least 3 characters long'),
    password: z
        .string()
        .trim()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters long')
        .max(32, 'Password must be at most 32 characters long'),
    birthDate: z.coerce
        .date({ required_error: 'Birth date is required' })
        .min(new Date('1900-01-01'), 'Invalid birth date')
        .max(new Date(), 'Birth date cannot be in the future')
        .refine((date) => new Date().getTime() - date.getTime() >= 14 * 365 * 24 * 60 * 60 * 1000, 'You must be at least 14 years old'),
});
