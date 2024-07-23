import { allowCyrillicRegExp, nameForSchema } from 'src/utils/constants';
import { z } from 'zod';

export const userSearchSchema = z.strictObject({
    name: nameForSchema.regex(allowCyrillicRegExp),
    page: z.number().min(0),
    limit: z.number().min(1, 'Limit must be between 1 and 10').max(10, 'Limit must be between 1 and 10'),
});