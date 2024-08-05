import React from 'react';
import { useProfile } from '@/shared/lib/hooks/useProfile';
import { debounce } from '@/shared/lib/utils/debounce';
import { api } from '@/shared/api';

const MAX_STATUS_SIZE = 70;
const STOP_SIZE = 200;

export const useMyAccount = () => {
    const { profile: { status }, setProfile } = useProfile();

    const [symbolsLeft, setSymbolsLeft] = React.useState(MAX_STATUS_SIZE - (status?.length ?? 0));
    const [statusValue, setStatusValue] = React.useState(status ?? '');

    const handleChangeStatus = ({ nativeEvent, target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
        const trimmedValue = value.trim();

        if (
            (nativeEvent && 'inputType' in nativeEvent && nativeEvent.inputType === 'insertLineBreak') ||
            value.length >= STOP_SIZE
        )
            return;

        setStatusValue(value);
        setSymbolsLeft(MAX_STATUS_SIZE - value.length);

        trimmedValue.length <= MAX_STATUS_SIZE && handleSetStatus(trimmedValue);
    };

    const handleSetStatus = React.useCallback(debounce(async (value: string) => {
        try {
            await api.user.status({ status: value });

            setProfile((prevState) => ({ ...prevState, status: value }));
        } catch (error) {
            console.error(error);
        }
    }, 500), []);

    return {
        symbolsLeft,
        statusValue,
        handleChangeStatus
    };
};