import React from 'react';
import { SearchUser } from '@/shared/model/types';
import { CreateGroupContext } from './context';

export const CreateGroupProvider = ({ children }: { children: React.ReactNode }) => {
    const [step, setStep] = React.useState(0);
    const [searchedUsers, setSearchedUsers] = React.useState<Array<SearchUser>>([]);
    const [selectedUsers, setSelectedUsers] = React.useState<Map<string, SearchUser>>(new Map());

    const handleSelect = React.useCallback((user: SearchUser) => {
        setSelectedUsers((prevState) => {
            const newState = new Map([...prevState]);

            newState.has(user._id) ? newState.delete(user._id) : newState.set(user._id, user);

            return newState;
        });
    }, []);

    const handleRemove = React.useCallback((id: string) => {
        setSelectedUsers((prevState) => {
            const newState = new Map([...prevState]);

            newState.delete(id);

            return newState;
        });
    }, []);

    const value = {
        step,
        searchedUsers,
        selectedUsers,
        handleSelect,
        handleRemove,
        setSearchedUsers,
        setStep
    };
    return <CreateGroupContext.Provider value={value}>{children}</CreateGroupContext.Provider>;
};