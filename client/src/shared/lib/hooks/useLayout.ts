import React from 'react';
import { useSession } from '@/entities/session/lib/hooks/useSession';
import { useProfile } from './useProfile';
import { SessionTypes } from '@/entities/session/model/types';
import { localStorageKeys } from '@/shared/constants';

export const useLayout = () => {
    const { setProfile } = useProfile();
    const { dispatch } = useSession();

    const [searchValue, setSearchValue] = React.useState('');
    const [openSheet, setOpenSheet] = React.useState(false);

    const searchInputRef = React.useRef<HTMLInputElement | null>(null);

    const handleLogout = React.useCallback(() => {
        setProfile(undefined!);
        dispatch({ type: SessionTypes.SET_ON_LOGOUT, payload: { isAuthorized: false } });
        localStorage.removeItem(localStorageKeys.TOKEN);
    }, [dispatch, setProfile]);

    const handleSearch = React.useCallback(({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(!value || !value.trim().length ? '' : value);
    }, []);

    return { searchValue, handleSearch, handleLogout, setOpenSheet, openSheet, searchInputRef };
};