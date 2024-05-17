import { HttpStatus } from "@nestjs/common";

export const CONVERSATION_POPULATE = [
    { path: 'participants', model: 'User', select: 'name email' },
    { path: 'messages', model: 'Message', populate: { path: 'sender', model: 'User', select: 'name email' } },
    { path: 'creator', model: 'User', select: 'name email' },
];

export const CONVERSATION_ALREADY_EXISTS = {
    message: 'conversation already exists',
    status: HttpStatus.CONFLICT,
};