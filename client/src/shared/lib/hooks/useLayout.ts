import React from 'react';
import { useSession } from '@/entities/session/lib/hooks/useSession';
import { useProfile } from './useProfile';
import { SessionTypes } from '@/entities/session/model/types';
import { localStorageKeys } from '@/shared/constants';
import { useFeed } from './useFeed';
import { debounce } from '../utils/debounce';
import { api } from '@/shared/api';
import { FeedTypes } from '@/shared/model/types';

export const useLayout = () => {
    const { setProfile } = useProfile();
    const { state: { accessToken }, dispatch } = useSession();
    const { onScrollFeedLoading, globalResults, localResults, setGlobalResults, setLocalResults } = useFeed();

    const [searchValue, setSearchValue] = React.useState('');
    const [searchLoading, setSearchLoading] = React.useState(false);
    const [openSheet, setOpenSheet] = React.useState(false);

    const searchInputRef = React.useRef<HTMLInputElement | null>(null);

    const handleLogout = React.useCallback(() => {
        setProfile(undefined!);
        dispatch({ type: SessionTypes.SET_ON_LOGOUT, payload: { isAuthorized: false } });
        localStorage.removeItem(localStorageKeys.TOKEN);
    }, [dispatch, setProfile]);

    const handleSearch = React.useCallback(({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        if (!value) {
            setSearchValue('');
            setGlobalResults([]);
            return;
        }

        const trimmedValue = value.trim();

        setSearchValue(!trimmedValue.length ? '' : value);

        trimmedValue.length > 3 && handleSearchDelay(trimmedValue);
    }, []);

    const handleSearchDelay = React.useCallback(debounce(async (value: string) => {
        try {
            setSearchLoading(true);

            const { data: users } = await api.user.search({ body: { username: value }, token: accessToken! });

            setGlobalResults(users.map((user) => ({ ...user, type: FeedTypes.USER })));
        } catch (error) {
            console.error(error);
            setGlobalResults([]);
        } finally {
            setSearchLoading(false);
        }}, 500), []);

    return {
        globalResults,
        localResults,
        onScrollFeedLoading,
        searchValue,
        searchLoading,
        openSheet,
        searchInputRef,
        handleSearch,
        handleLogout,
        setOpenSheet,
        setLocalResults
    };
};