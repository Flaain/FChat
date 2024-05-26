import React from 'react';
import { useModal } from '@/shared/lib/hooks/useModal';
import { CreateChatType } from './types';
import { CreateChatContainerContext } from './context';

const titles: Record<CreateChatType, string> = {
    choose: 'Choose chat mode',
    group: 'Create group',
    private: 'Create private conversation'
};

export const CreateChatContainerProvider = ({ children }: { children: React.ReactNode }) => {
    const [type, setType] = React.useState<CreateChatType>('choose');

    const { handleChangeTitle } = useModal();

    const handleTypeChange = (type: CreateChatType) => {
        handleChangeTitle(titles[type]);
        setType(type);
    };

    return (
        <CreateChatContainerContext.Provider
            value={{
                type,
                handleTypeChange
            }}
        >
            {children}
        </CreateChatContainerContext.Provider>
    );
};