import { IAppException } from 'src/utils/types';

export const userExistError: Pick<IAppException, 'message' | 'errors'> = {
    message: 'User already exists',
    errors: [{ message: 'User already exists', path: 'name' }],
};

export const emailExistError: Pick<IAppException, 'message' | 'errors'> = {
    message: 'Email already exists',
    errors: [{ message: 'Email already exists', path: 'email' }],
}