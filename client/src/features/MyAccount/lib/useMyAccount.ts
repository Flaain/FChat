import React from 'react';
import { useProfile } from '@/entities/profile';
import { MAX_STATUS_SIZE, STOP_SIZE } from '@/entities/profile/model/constants';
import { useShallow } from 'zustand/shallow';

export const useMyAccount = () => {
    const { status, handleSetStatus } = useProfile(useShallow((state) => ({
        status: state.profile.status,
        handleSetStatus: state.actions.handleSetStatus
    })));

    const [symbolsLeft, setSymbolsLeft] = React.useState(MAX_STATUS_SIZE - (status?.length ?? 0));
    const [statusValue, setStatusValue] = React.useState(status ?? '');
    
    const onChangeStatus = ({ nativeEvent, target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
        const trimmedValue = value.trim();

        if ((nativeEvent && 'inputType' in nativeEvent && nativeEvent.inputType === 'insertLineBreak') || value.length >= STOP_SIZE) return;

        setStatusValue(value);
        setSymbolsLeft(MAX_STATUS_SIZE - value.length);

        trimmedValue.length <= MAX_STATUS_SIZE && handleSetStatus(trimmedValue);
    };

    return {
        symbolsLeft,
        statusValue,
        onChangeStatus,
    };
};