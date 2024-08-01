import { z } from 'zod';
import { allowCyrillicRegExp, loginForSchema, nameForSchema, regExpError } from '@/shared/constants';

export const createGroupSchema = z.object({
    username: z.string().optional(),
    displayName: nameForSchema.regex(allowCyrillicRegExp, regExpError),
    groupName: loginForSchema
});