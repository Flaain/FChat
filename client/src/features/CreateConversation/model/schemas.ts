import { z } from 'zod';
import { allowCyrillicRegExp, nameForSchema, regExpError } from '@/shared/constants';

export const createConversationSchema = z.object({
    username: nameForSchema.regex(allowCyrillicRegExp, regExpError)
});