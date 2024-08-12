import { z } from 'zod';

export const routerList = {
    HOME: '/',
    AUTH: '/auth',
    CONVERSATION: '/conversation/:id'
};
export const localStorageKeys = {
    THEME: 'theme',
    TOKEN: 'token'
};

export const MIN_USER_SEARCH_LENGTH = 2;
export const MAX_GROUP_SIZE = 10;

export const onlyLatinRegExp = /^[a-zA-Z0-9_]*$/;
export const allowCyrillicRegExp = /^[\p{L}0-9\s]*$/u;
export const regExpError = 'Name must contain only letters, numbers, and spaces';

export const emailForSchema = z.string().trim().min(1, 'Email is required').email('Invalid email address').toLowerCase();
export const passwordForSchema = z
    .string()
    .trim()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters long')
    .max(32, 'Password must be at most 32 characters long');

export const nameForSchema = z
    .string()
    .trim()
    .min(1, 'Name is required')
    .min(3, 'Name must be at least 3 characters long')
    .max(32, 'Name must be at most 32 characters long');

export const loginForSchema = z
    .string()
    .trim()
    .min(5, 'Login must be at least 5 characters long')
    .max(32, 'Login must be at most 32 characters long')
    .toLowerCase()
    .regex(onlyLatinRegExp, 'Invalid login. Please use only a-z, 0-9 and underscore characters');

export const passwordRules: Array<{ rule: (password: string) => boolean; message: string }> = [
    {
        rule: (password: string) => /[A-Z]/.test(password),
        message: 'Password must contain at least one uppercase letter'
    },
    {
        rule: (password: string) => /[a-z]/.test(password),
        message: 'Password must contain at least one lowercase letter'
    },
    {
        rule: (password: string) => /[0-9]/.test(password),
        message: 'Password must contain at least one number'
    },
    {
        rule: (password: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
        message: 'Password must contain at least one special character'
    }
];