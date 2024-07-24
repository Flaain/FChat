import { z } from 'zod';
import { messageForSchema } from 'src/utils/constants';
import { isValidObjectId } from 'mongoose';

export const messageEditSchema = z
    .object({
        message: messageForSchema,
        conversationId: z.string().min(1, 'conversatiionId is required'),
        recipientId: z.string().min(1, 'recipientId is required'),
    })
    .refine(({ recipientId, conversationId }) => isValidObjectId(recipientId) && isValidObjectId(conversationId), {
        message: `Invalid object id`,
    });