import React from 'react';
import { SearchUser } from '@/shared/model/types';
import { CreateConversationContext } from './context';

export const CreateConversationProvider = ({ children }: { children: React.ReactNode }) => {
    const [step, setStep] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
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

    const value = React.useMemo(
        () => ({
            step,
            loading,
            searchedUsers,
            selectedUsers,
            handleSelect,
            handleRemove,
            setSearchedUsers,
            setStep,
            setLoading
        }),
        [handleRemove, handleSelect, loading, searchedUsers, selectedUsers, step]
    );

    return <CreateConversationContext.Provider value={value}>{children}</CreateConversationContext.Provider>;
};