import { passwordRules } from "@/shared/constants";
import { z } from "zod";

export const signinSchema = z.strictObject({
    email: z.string().email("Invalid email address"),
    password: z.string().trim().min(6, "Password must be at least 6 characters long"),
});

export const firstStepSignUpSchema = z
    .object({
        email: z.string().min(1, "Email is required").email("Invalid email address"),
        password: z
            .string()
            .trim()
            .min(1, "Password is required")
            .min(6, "Password must be at least 6 characters long")
            .max(32, "Password must be at most 32 characters long"),
        confirmPassword: z.string().trim().min(1, "Confirm password is required"),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
        for (const { rule, message } of passwordRules) {
            if (!rule(password)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["password"],
                    message,
                });
            }
        }

        if (confirmPassword !== password) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["confirmPassword"],
                message: "Passwords do not match",
            });
        }
    });

export const secondStepSignUpSchema = z.object({
    name: z
        .string()
        .regex(/^[a-zA-Z0-9\s]*$/, "Name must contain only letters, numbers, and spaces")
        .trim()
        .min(1, "Name is required")
        .min(3, "Name must be at least 3 characters long")
        .max(32, "Name must be at most 32 characters long"),
    birthDate: z.coerce
        .date({ required_error: "Birth date is required" })
        .min(new Date("1900-01-01"), "Invalid birth date")
        .transform((date, ctx) => {
            if (new Date().getTime() - date.getTime() < 14 * 365 * 24 * 60 * 60 * 1000) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "You must be at least 14 years old",
                });
            }

            return date.toISOString();
        }),
});

export const signupSchema = z.intersection(firstStepSignUpSchema, secondStepSignUpSchema);