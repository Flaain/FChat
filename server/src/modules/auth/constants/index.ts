import { IAppException } from 'src/utils/types';

export const userExistError: Pick<IAppException, 'message' | 'errors'> = {
    message: 'User already exists',
    errors: [{ message: 'User already exists', path: 'name' }],
};

export const emailExistError: Pick<IAppException, 'message' | 'errors'> = {
    message: 'Email already exists',
    errors: [{ message: 'Email already exists', path: 'email' }],
}

export const reservedUsernames = [
    'fchat',
    'admin',
    'administrator',
    'moderator',
    'root',
    'support',
    'system',
    'superuser',
    'guest',
    'owner',
    'webmaster',
    'info',
    'help',
    'service',
    'user',
    'test',
    'manager',
    'operator',
    'developer',
    'staff',
    'team',
    'bot',
    'noreply',
    'contact',
    'account',
    'billing',
    'sales',
    'security',
    'operations',
    'network',
    'sysadmin',
    'customer',
    'official',
    'qa',
    'techsupport',
    'api',
    'maintenance',
    'monitoring',
];