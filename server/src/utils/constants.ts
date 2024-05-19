import { HttpStatus } from '@nestjs/common';
import { z } from 'zod';

export const nameForSchema = z
    .string()
    .regex(/^[a-zA-Z0-9\s]*$/, 'Name must contain only letters, numbers, and spaces')
    .trim()
    .min(1, 'Name is required')
    .min(3, 'Name must be at least 3 characters long')
    .max(32, 'Name must be at most 32 characters long');

export const messageForSchema = z
    .string()
    .trim()
    .min(1, "Message can't be empty")
    .max(1000, "Message can't be longer than 1000 characters");

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
};

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

export const CONVERSATION_POPULATE = [
    { path: 'participants', model: 'User', select: 'name email isVerified' },
    { path: 'messages', model: 'Message', populate: { path: 'sender', model: 'User', select: 'name email isVerified' } },
    { path: 'creator', model: 'User', select: 'name email' },
];


export const emailForSchema = z.string().trim().min(1, 'Email is required').email('Invalid email address');