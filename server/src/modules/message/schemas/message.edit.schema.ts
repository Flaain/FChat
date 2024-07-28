import { z } from 'zod';
import { messageForSchema } from 'src/utils/constants';
import { isValidObjectId } from 'mongoose';

export const messageEditSchema = z
    .object({
        message: messageForSchema,
        conversationId: z.string().min(1, 'conversatiionId is required').max(24, 'conversatiionId is invalid'),
        recipientId: z.string().min(1, 'recipientId is required').max(24, 'recipientId is invalid'),
    })
    .refine(({ recipientId, conversationId }) => isValidObjectId(recipientId) && isValidObjectId(conversationId), {
        message: `Invalid object id`,
    });