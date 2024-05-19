import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

export const messageDeleteSchema = z.object({
    conversationId: z
        .string()
        .trim()
        .min(1, 'Conversation id is required')
        .refine((id) => isValidObjectId(id), { message: 'Invalid conversation id' }),
});