import { z } from 'zod';

export const messageSendSchema = z.object({
    message: z
        .string()
        .trim()
        .min(1, "Message can't be empty")
        .max(1000, "Message can't be longer than 1000 characters"),
});
