import { z } from 'zod';

export const conversationCreateSchema = z
    .object({
        participants: z
            .array(z.string())
            .min(1, 'At least two participants are required')
            .max(10, 'Too many participants'),
        name: z
            .string()
            .trim()
            .min(1, 'Name is required')
            .max(32, 'Name must be at most 32 characters long')
            .optional(),
    })
    .superRefine(({ participants, name }, ctx) => {
        participants.length >= 2 && !name && ctx.addIssue({
            code: 'custom',
            message: 'Conversation name for groups is required'
        });
    });