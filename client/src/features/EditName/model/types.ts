import { z } from 'zod';
import { editNameSchema } from './schema';

export type EditNameType = z.infer<typeof editNameSchema>;