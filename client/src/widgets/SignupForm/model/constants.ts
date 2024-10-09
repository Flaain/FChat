import { FieldPath } from 'react-hook-form';
import { SignupSchemaType } from './types';

export const steps: Array<{ fields: Array<FieldPath<SignupSchemaType>> }> = [
    { fields: ['email', 'password', 'confirmPassword'] },
    { fields: ['name', 'login', 'birthDate'] },
    { fields: ['otp'] }
];