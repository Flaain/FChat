import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

export const messageDeleteSchema = z
    .object({
        conversationId: z.string().trim().min(1, 'Conversation id is required'),
        recipientId: z.string().trim().min(1, 'Recipient id is required'),
    })
    .refine(({ conversationId, recipientId }) => isValidObjectId(conversationId) && isValidObjectId(recipientId), {
        message: 'Invalid conversation id',
    });