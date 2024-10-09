import React from 'react';
import { ICreateGroupContext } from './types';

export const CreateGroupContext = React.createContext<ICreateGroupContext>({
    form: null!,
    handleBack: () => {},
    onSubmit: () => {},
    handleSelect: () => {},
    handleRemove: () => {},
    handleSearchUser: () => {},
    step: 0,
    selectedUsers: new Map(),
    isNextButtonDisabled: false,
    searchedUsers: []
});

export const useCreateGroup = () => React.useContext(CreateGroupContext);