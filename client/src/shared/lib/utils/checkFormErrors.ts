import { AppException } from '@/shared/api/error';
import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

export interface CheckFormErrorsParams<T extends FieldValues> {
    error: unknown;
    form: UseFormReturn<T>;
    fields: Array<FieldPath<T>>;
    cb?: (error: { path : string, message: string }) => void;
}

export const checkFormErrors = <T extends FieldValues>({ error, form, fields, cb }: CheckFormErrorsParams<T>) => {
    if (error instanceof AppException) {
        error.errors?.forEach(({ path, message }) => {
            if (fields.includes(path as FieldPath<T>)) {
                form.setError(path as FieldPath<T>, { message }, { shouldFocus: true });
                cb?.({ path, message });
            }
        });

        !error.errors && error.toastError();
    }
};