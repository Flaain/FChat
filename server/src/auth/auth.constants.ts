import { HttpStatus } from '@nestjs/common';

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
