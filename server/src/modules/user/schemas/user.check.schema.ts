import { z } from 'zod';
import { allowCyrillicRegExp, emailForSchema, nameForSchema } from 'src/utils/constants';
import { reservedUsernames } from '../constants';

export const userCheckSchema = z
    .strictObject({
        type: z.enum(['email', 'name']),
        email: emailForSchema.optional(),
        name: nameForSchema.regex(allowCyrillicRegExp).optional(),
    })
    .superRefine(({ type, email, name }, ctx) => {
        const actions: Record<typeof type, () => void> = {
            email: () => {
                !email && ctx.addIssue({ code: 'custom', message: 'Please provide email', path: ['email'] });
            },
            name: () => {
                if (!name) {
                    ctx.addIssue({
                        code: 'custom',
                        message: 'Please provide name',
                        path: ['name'],
                        fatal: true
                    });

                    return z.NEVER;
                }

                reservedUsernames.includes(name.toLowerCase()) && ctx.addIssue({
                    code: 'custom',
                    message: 'Sorry this name is reserved',
                    path: ['name'],
                });
            },
        };

        actions[type]();
    });
