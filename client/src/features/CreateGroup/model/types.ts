import React from 'react';
import { z } from 'zod';
import { SearchUser } from '@/shared/model/types';
import { createGroupSchema } from './schemas';

export type CreateGroupType = z.infer<typeof createGroupSchema>;

export interface CreateGroupContextProps {
    step: number;
    searchedUsers: Array<SearchUser>;
    selectedUsers: Map<string, SearchUser>;
    handleSelect: (user: SearchUser) => void;
    handleRemove: (id: string) => void;
    setSearchedUsers: React.Dispatch<React.SetStateAction<Array<SearchUser>>>;
    setStep: React.Dispatch<React.SetStateAction<number>>;
}