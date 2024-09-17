import { AppException } from '@/shared/api/error';
import { CheckFormErrorsParams } from '@/shared/model/types';
import { FieldPath, FieldValues } from 'react-hook-form';

export const checkFormErrors = <T extends FieldValues>({ error, form, step, steps }: CheckFormErrorsParams<T>) => {
    if (error instanceof AppException) {
        error.errors?.forEach(({ path, message }) => {
            steps[step].fields.includes(path as FieldPath<T>) && form.setError(path as FieldPath<T>, { message }, { shouldFocus: true });
        });

        !error.errors && error.toastError();
    }
};