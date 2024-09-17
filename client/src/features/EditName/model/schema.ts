import { z } from 'zod';
import { nameForSchema } from '@/shared/constants';

export const editNameSchema = z.object({ name: nameForSchema });