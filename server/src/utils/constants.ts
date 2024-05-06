import { HttpStatus } from '@nestjs/common';
import { z } from 'zod';

export const nameForSchema = z
    .string()
    .regex(
        /^[a-zA-Z0-9\s]*$/,
        'Name must contain only letters, numbers, and spaces',
    )
    .trim()
    .min(1, 'Name is required')
    .min(3, 'Name must be at least 3 characters long')
    .max(32, 'Name must be at most 32 characters long');

export const SOMETHING_WENT_WRONG = {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'something went wrong',
};

export const INVALID_CREDENTIALS = {
    status: HttpStatus.UNAUTHORIZED,
    message: 'invalid credentials',
};

export const UNAUTHORIZED = {
    status: HttpStatus.UNAUTHORIZED,
    message: 'unauthorized',
}

export const USER_NOT_FOUND = {
    status: HttpStatus.NOT_FOUND,
    message: 'please try to search for another user',
    type: 'form',
    error: {
        username: {
            message: 'user not found',
        },
    },
};

export const CONVERSATION_ALREADY_EXISTS = {
    status: HttpStatus.BAD_REQUEST,
    message: 'conversation already exists',
}

export const emailForSchema = z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Invalid email address');