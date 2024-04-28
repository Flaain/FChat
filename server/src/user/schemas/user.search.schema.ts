import { z } from 'zod';

export const userSearchSchema = z.object({ name: z.string() });