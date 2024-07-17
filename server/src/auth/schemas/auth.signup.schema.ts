import { z } from 'zod';
import { allowCyrillicRegExp, emailForSchema, nameForSchema, regExpError } from 'src/utils/constants';

const reservedUsernames = [
    'fchat',
    'admin',
    'administrator',
    'moderator',
    'root',
    'support',
    'system',
    'superuser',
    'guest',
    'owner',
    'webmaster',
    'info',
    'help',
    'service',
    'user',
    'test',
    'manager',
    'operator',
    'developer',
    'staff',
    'team',
    'bot',
    'noreply',
    'contact',
    'account',
    'billing',
    'sales',
    'security',
    'operations',
    'network',
    'sysadmin',
    'customer',
    'official',
    'qa',
    'techsupport',
    'api',
    'maintenance',
    'monitoring',
];

export const signupSchema = z
    .strictObject({
        email: emailForSchema,
        name: nameForSchema.regex(allowCyrillicRegExp, regExpError),
        password: z
            .string()
            .trim()
            .min(1, 'Password is required')
            .min(6, 'Password must be at least 6 characters long')
            .max(32, 'Password must be at most 32 characters long')
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&#])[A-Za-z\d@$!%?&#]+$/,
                'Password must contain at least one uppercase, one lowercase, one number, and one special character letter',
            ),
        birthDate: z.coerce
            .date({ required_error: 'Birth date is required' })
            .min(new Date('1900-01-01'), 'Invalid birth date')
            .max(new Date(), 'Birth date cannot be in the future')
            .refine(
                (date) => new Date().getTime() - date.getTime() >= 14 * 365 * 24 * 60 * 60 * 1000,
                'You must be at least 14 years old',
            ),
    })
    .refine(({ name }) => !reservedUsernames.includes(name.toLowerCase()), {
        message: 'Sorry, this name is reserved',
        path: ['name'],
    });