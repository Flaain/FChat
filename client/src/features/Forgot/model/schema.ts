import { z } from 'zod';
import { emailForSchema, passwordForSchema, passwordRules } from '@/shared/constants';

export const firstStepSchema = z.object({
    email: emailForSchema
});

export const secondStepSchema = z.object({
    otp: z.string()
});

export const thirdStepSchema = z
    .object({
        password: passwordForSchema,
        confirmPassword: passwordForSchema
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
        for (const { rule, message } of passwordRules) {
            !rule(password) && ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['password'],
                message
            });
        }

        confirmPassword !== password && ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['confirmPassword'],
            message: 'Passwords do not match'
        });
    });

export const forgotSchema = firstStepSchema.and(secondStepSchema).and(thirdStepSchema);
