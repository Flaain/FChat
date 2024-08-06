import React from 'react';
import { z } from 'zod';
import { SearchUser } from '@/shared/model/types';
import { createGroupSchema } from './schemas';
import { UseFormReturn } from 'react-hook-form';

export type CreateGroupType = z.infer<typeof createGroupSchema>;

export interface CreateGroupContextProps {
    form: UseFormReturn<CreateGroupType>;
    step: number;
    selectedUsers: Map<string, SearchUser>;
    searchedUsers: Array<SearchUser>;
    isNextButtonDisabled: boolean;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    handleSelect: (user: SearchUser) => void;
    handleRemove: (id: string) => void;
    handleSearchUser: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleBack: () => void;
}