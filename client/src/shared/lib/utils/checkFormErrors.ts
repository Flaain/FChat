import { AppException } from '@/shared/api/error';
import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

export interface CheckFormErrorsParams<T extends FieldValues> {
    error: unknown;
    form: UseFormReturn<T>;
    fields: Array<FieldPath<T>>;
}

export const checkFormErrors = <T extends FieldValues>({ error, form, fields }: CheckFormErrorsParams<T>) => {
    if (error instanceof AppException) {
        error.errors?.forEach(({ path, message }) => {
            fields.includes(path as FieldPath<T>) && form.setError(path as FieldPath<T>, { message }, { shouldFocus: true });
        });

        !error.errors && error.toastError();
    }
};