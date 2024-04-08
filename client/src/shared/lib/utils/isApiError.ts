import { signupSchema } from "@/pages/Auth/model/schema";
import { APIError } from "@/shared/model/types";
import { FieldErrors } from "react-hook-form";
import { z } from "zod";

export const isApiError = (error: unknown): error is APIError<unknown> => {
    if (error && typeof error === "object") return true;
    return false;
}

export const isSignupFormError = (error: unknown): error is APIError<FieldErrors<z.infer<typeof signupSchema>>> => {
    if (isApiError(error) && typeof error.error === "object") return true;
    return false;
};