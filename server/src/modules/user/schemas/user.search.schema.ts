import { z } from 'zod';

export const userSearchSchema = z
    .string({ invalid_type_error: 'Name must be a string' })
    .trim()
    .min(3, 'Name is too short')
    .max(32, 'Name is too long');