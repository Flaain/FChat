import { z } from 'zod';

export const messageDeleteSchema = z.object({
    conversationId: z.string().trim().min(1, 'Conversation id is required'),
});