import React from 'react';
import { useSession } from '@/entities/session/lib/hooks/useSession';
import { useProfile } from './useProfile';
import { SessionTypes } from '@/entities/session/model/types';
import { localStorageKeys } from '@/shared/constants';
import { useFeed } from './useFeed';
import { debounce } from '../utils/debounce';
import { api } from '@/shared/api';

export const useLayout = () => {
    const { setProfile } = useProfile();
    const { state: { accessToken }, dispatch } = useSession();
    const { feed, feedIsLoading, onScrollFeedLoading, setFeed, handleFetchFeed } = useFeed();

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
            handleFetchFeed();
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

            setFeed(users);
        } catch (error) {
            console.error(error);
            setFeed([]);
        } finally {
            setSearchLoading(false);
        }
    }, 500), []);

    return {
        feed,
        feedIsLoading,
        onScrollFeedLoading,
        searchValue,
        searchLoading,
        handleSearch,
        handleLogout,
        setOpenSheet,
        openSheet,
        searchInputRef
    };
};