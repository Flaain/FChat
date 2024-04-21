import { APIError } from "@/shared/model/types";
import { FieldErrors, FieldValues } from "react-hook-form";

export const isApiError = (error: unknown): error is APIError<unknown> => !!error && typeof error === "object";
export const isFormError = <T extends FieldValues>(error: unknown): error is APIError<FieldErrors<T>> => isApiError(error) && error.type === "form";
