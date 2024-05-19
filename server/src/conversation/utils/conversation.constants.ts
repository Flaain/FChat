import { HttpStatus } from "@nestjs/common";

export const CONVERSATION_ALREADY_EXISTS = {
    message: 'conversation already exists',
    status: HttpStatus.CONFLICT,
};