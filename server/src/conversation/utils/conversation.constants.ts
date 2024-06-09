import { HttpStatus } from '@nestjs/common';

export const CONVERSATION_ALREADY_EXISTS = {
    message: 'conversation already exists',
    status: HttpStatus.CONFLICT,
};

export const CONVERSATION_WITH_MYSELF = {
    message: 'This feature is not available yet',
    status: HttpStatus.BAD_REQUEST,
};