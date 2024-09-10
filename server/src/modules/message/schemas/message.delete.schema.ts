import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

export const messageDeleteSchema = z
    .object({ recipientId: z.string().trim().min(1, 'Recipient id is required').max(24, 'Recipient id is invalid') })
    .refine(({ recipientId }) => isValidObjectId(recipientId), { message: 'Invalid conversation id' });