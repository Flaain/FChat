import { z } from "zod";

export const emailForSchema = z.string().min(1, "Email is required").email("Invalid email address");
export const passwordForSchema = z
    .string()
    .trim()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long")
    .max(32, "Password must be at most 32 characters long");