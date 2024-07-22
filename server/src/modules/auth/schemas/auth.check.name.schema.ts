import { z } from 'zod';
import { allowCyrillicRegExp, nameForSchema } from 'src/utils/constants';
import { reservedUsernames } from '../constants';

export const checkNameSchema = z
    .object({ name: nameForSchema.regex(allowCyrillicRegExp) })
    .refine(({ name }) => !reservedUsernames.includes(name.toLowerCase()), {
        message: 'Sorry, this name is reserved',
        path: ['name'],
    });