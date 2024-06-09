import React from 'react';
import { z } from 'zod';
import { SearchUser } from '@/shared/model/types';
import { createGroupSchema } from './schemas';
import { UseFormReturn } from 'react-hook-form';

export type CreateGroupType = z.infer<typeof createGroupSchema>;

export interface SelectStageProps {
    form: UseFormReturn<CreateGroupType>;
    selectedUsers: Map<string, SearchUser>;
    searchedUsers: Array<SearchUser>;
    handleSelect: (user: SearchUser) => void;
    handleRemove: (id: string) => void;
    handleSearchUser: (event: React.ChangeEvent<HTMLInputElement>) => void;
}