import React from 'react';
import { z } from 'zod';
import { APIData, SearchUser } from '@/shared/model/types';
import { createGroupSchema } from './schemas';
import { UseFormReturn } from 'react-hook-form';

export type CreateGroupType = z.infer<typeof createGroupSchema>;
export type CreateGroupParams = Omit<z.infer<typeof createGroupSchema>, 'username'> & { participants: Array<string> };

export interface ICreateGroupContext {
    form: UseFormReturn<CreateGroupType>;
    step: number;
    selectedUsers: Map<string, SearchUser>;
    searchedUsers: Array<SearchUser>;
    isNextButtonDisabled: () => boolean;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    handleSelect: (user: SearchUser) => void;
    handleRemove: (id: string) => void;
    handleSearchUser: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleBack: () => void;
}

export interface ICreateGroupAPI {
    create(params: CreateGroupParams): Promise<APIData<{ _id: string }>>;
}