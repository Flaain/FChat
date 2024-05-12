import { nameForSchema } from '@/shared/constants';
import { z } from 'zod';

export const createConversationSchema = z.object({
    username: nameForSchema,
    groupName: z
        .string()
        .regex(/^[a-zA-Z0-9\s]*$/, 'Group name must contain only letters, numbers, and spaces')
        .trim()
        .min(3, 'Group name must be at least 3 characters long')
        .max(32, 'Group name must be at most 32 characters long')
        .optional()
        .or(z.literal(''))
});