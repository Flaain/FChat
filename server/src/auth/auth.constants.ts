import { HttpStatus } from '@nestjs/common';
import { z } from 'zod';

export const NAME_ALREADY_EXISTS = {
    status: HttpStatus.BAD_REQUEST,
    message: 'please try to signup with another name',
    type: 'form',
    error: {
        name: {
            message: 'user with this name already exists',
        },
    },
};

export const EMAIL_ALREADY_EXISTS = {
    status: HttpStatus.BAD_REQUEST,
    message: 'please try to signup with another email',
    type: 'form',
    error: {
        email: {
            message: 'user with this email already exists',
        },
    },
};

export const SOMETHING_WENT_WRONG = {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'something went wrong',
};

export const INVALID_CREDENTIALS = {
    status: HttpStatus.UNAUTHORIZED,
    message: 'invalid credentials',
};

export const nameForAuthSchema = z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9\s]*$/, 'Name must contain only letters, numbers, and spaces')
    .min(1, 'Name is required')
    .min(3, 'Name must be at least 3 characters long')
    .max(32, 'Name must be at most 32 characters long');

export const emailForAuthSchema = z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Invalid email address');