import React from 'react';
import { CreateConversationContextProps } from './types';

export const CreateConversationContext = React.createContext<CreateConversationContextProps>({
    handleRemove: () => {},
    handleSelect: () => {},
    searchedUsers: [],
    selectedUsers: new Map(),
    setStep: () => {},
    setLoading: () => {},
    setSearchedUsers: () => {},
    step: 0,
    loading: false
});