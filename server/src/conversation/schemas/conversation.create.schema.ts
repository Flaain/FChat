import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

export const conversationCreateSchema = z
    .object({
        participants: z
            .array(z.string())
            .min(1, 'At least two participants are required')
            .max(10, 'Too many participants'),
        name: z
            .string()
            .regex(/^[a-zA-Z0-9\s]*$/, 'Group name must contain only letters, numbers, and spaces')
            .trim()
            .min(3, 'Group name must be at least 3 characters long')
            .max(32, 'Group name must be at most 32 characters long')
            .optional()
            .or(z.literal('')),
    })
    .superRefine(({ participants }, ctx) => {
        participants.forEach((participant) => {
            !isValidObjectId(participant) && ctx.addIssue({
                code: 'custom',
                message: `Invalid participant id (${participant})`,
                path: ['participants'],
            });
        });
    });