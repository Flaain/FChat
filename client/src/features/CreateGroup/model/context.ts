import React from 'react';
import { CreateGroupContextProps } from './types';

export const CreateGroupContext = React.createContext<CreateGroupContextProps>({
    form: undefined!,
    handleBack: () => {},
    handleSelect: () => {},
    handleRemove: () => {},
    handleSearchUser: () => {},
    onSubmit: () => {},
    isNextButtonDisabled: false,
    searchedUsers: [],
    selectedUsers: new Map(),
    step: 0
});