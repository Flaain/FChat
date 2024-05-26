import { allowCyrillicRegExp, nameForSchema, onlyLatinRegExp, regExpError } from '@/shared/constants';
import { z } from 'zod';

export const createGroupSchema = z.object({
    username: z.string(),
    displayName: nameForSchema.regex(allowCyrillicRegExp, regExpError),
    groupName: nameForSchema.regex(onlyLatinRegExp, regExpError)
});