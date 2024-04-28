import { z } from "zod";

export const routerList = {
    HOME: "/",
    AUTH: "/auth",
    CONVERSATION: "/conversation/:id",
};
export const localStorageKeys = {
    THEME: "theme",
    TOKEN: "token",
    ASIDE_PANEL_SIZE: "aside-panel-size",
};
export const emailForSchema = z.string().min(1, "Email is required").email("Invalid email address");
export const passwordForSchema = z
    .string()
    .trim()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long")
    .max(32, "Password must be at most 32 characters long");
export const nameForSchema = z
    .string()
    .regex(/^[a-zA-Z0-9\s]*$/, "Name must contain only letters, numbers, and spaces")
    .trim()
    .min(1, "Name is required")
    .min(3, "Name must be at least 3 characters long")
    .max(32, "Name must be at most 32 characters long");
export const passwordRules: Array<{ rule: (password: string) => boolean; message: string }> = [
    {
        rule: (password: string) => /[A-Z]/.test(password),
        message: "Password must contain at least one uppercase letter",
    },
    {
        rule: (password: string) => /[a-z]/.test(password),
        message: "Password must contain at least one lowercase letter",
    },
    {
        rule: (password: string) => /[0-9]/.test(password),
        message: "Password must contain at least one number",
    },
    {
        rule: (password: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
        message: "Password must contain at least one special character",
    },
];