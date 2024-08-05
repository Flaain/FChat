import { nameForSchema } from '@/shared/constants';
import { z } from 'zod';

export const editNameSchema = z.object({
    name: nameForSchema
});