import { FieldPath } from 'react-hook-form';
import { CreateGroupType } from './types';

export const MAX_GROUP_SIZE = 10;

export const steps: Array<{ fields: Array<FieldPath<CreateGroupType>> }> = [
    { fields: ['name'] },
    { fields: ['username'] },
    { fields: ['login'] }
];