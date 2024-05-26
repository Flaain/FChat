import React from 'react';
import { CreateGroupContextProps } from './types';

export const CreateGroupContext = React.createContext<CreateGroupContextProps>({
    handleRemove: () => {},
    handleSelect: () => {},
    searchedUsers: [],
    selectedUsers: new Map(),
    setStep: () => {},
    setSearchedUsers: () => {},
    step: 0,
});