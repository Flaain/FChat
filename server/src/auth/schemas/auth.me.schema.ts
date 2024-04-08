import { z } from 'zod';

export const meRequestSchema = z.object({
    accessToken: z.string(),
});