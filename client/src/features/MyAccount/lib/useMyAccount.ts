import React from 'react';
import { useProfile } from '@/entities/profile';
import { MAX_STATUS_SIZE, STOP_SIZE } from '@/entities/profile/model/constants';

export const useMyAccount = () => {
    const { profile: { status }, handleChangeStatus } = useProfile((state) => ({ profile: state.profile, handleChangeStatus: state.handleChangeStatus }));
    
    const [symbolsLeft, setSymbolsLeft] = React.useState(MAX_STATUS_SIZE - (status?.length ?? 0));
    const [statusValue, setStatusValue] = React.useState(status ?? '');
    
    const onChangeStatus = ({ nativeEvent, target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
        const trimmedValue = value.trim();

        if ((nativeEvent && 'inputType' in nativeEvent && nativeEvent.inputType === 'insertLineBreak') || value.length >= STOP_SIZE) return;

        setStatusValue(value);
        setSymbolsLeft(MAX_STATUS_SIZE - value.length);

        trimmedValue.length <= MAX_STATUS_SIZE && handleChangeStatus(trimmedValue);
    };

    return {
        symbolsLeft,
        statusValue,
        onChangeStatus,
    };
};