import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

export const messageDeleteSchema = z
    .object({
        conversationId: z.string().trim().min(1, 'Conversation id is required').max(24, 'Conversation id is invalid'),
        recipientId: z.string().trim().min(1, 'Recipient id is required').max(24, 'Recipient id is invalid'),
    })
    .refine(({ conversationId, recipientId }) => isValidObjectId(conversationId) && isValidObjectId(recipientId), {
        message: 'Invalid conversation id',
    });