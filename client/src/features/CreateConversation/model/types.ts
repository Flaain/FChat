import React from 'react';
import { z } from 'zod';
import { SearchUser } from '@/shared/model/types';
import { createConversationSchema } from './schemas';

export type CreateConversationFormType = z.infer<typeof createConversationSchema>;

export interface CreateConversationContextProps {
    step: number;
    loading: boolean;
    searchedUsers: Array<SearchUser>;
    selectedUsers: Map<string, SearchUser>;
    handleSelect: (user: SearchUser) => void;
    handleRemove: (id: string) => void;
    setSearchedUsers: React.Dispatch<React.SetStateAction<Array<SearchUser>>>;
    setStep: React.Dispatch<React.SetStateAction<number>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}