import { z } from "zod";

export const signinSchema = z.strictObject({
    email: z.string().email("Invalid email address"),
    password: z.string().trim().min(6, "Password must be at least 6 characters long"),
});

export const signupSchema = z
    .strictObject({
        email: z.string().min(1, "Email is required").email("Invalid email address"),
        name: z.string().trim().min(1, "Name is required").min(3, "Name must be at least 3 characters long"),
        password: z
            .string()
            .trim()
            .min(1, "Password is required")
            .min(6, "Password must be at least 6 characters long")
            .max(32, "Password must be at most 32 characters long"),
        confirmPassword: z
            .string()
            .trim()
            .min(1, "Confirm password is required")
            .min(6, "Password must be at least 6 characters long"),
        birthDate: z.string().min(1, "Birth date is required"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })
    .refine((data) => new Date(data.birthDate).getTime() - new Date("1900-01-01").getTime() > 0, {
        message: "Invalid birth date",
        path: ["birthDate"],
    })
    .refine((data) => new Date() > new Date(data.birthDate), {
        message: "Birth date cannot be in the future",
        path: ["birthDate"],
    })
    .refine((data) => new Date().getTime() - new Date(data.birthDate).getTime() >= 14 * 365 * 24 * 60 * 60 * 1000, {
        message: "You must be at least 14 years old",
        path: ["birthDate"],
    });