import React from 'react';
import { api } from '@/shared/api';
import { useSession } from '@/entities/session/lib/hooks/useSession';
import { useProfile } from './useProfile';
import { SessionTypes } from '@/entities/session/model/types';
import { localStorageKeys } from '@/shared/constants';
import { useFeed } from './useFeed';
import { debounce } from '../utils/debounce';
import { ConversationFeed, Drafts, FeedTypes } from '@/shared/model/types';
import { useSocket } from './useSocket';
import { SocketEvents } from '../contexts/socket/types';

const MIN_SEARCH_LENGTH = 3;

export const useLayout = () => {
    const { setProfile } = useProfile();
    const { state: { accessToken }, dispatch } = useSession();
    const { socket } = useSocket();
    const { onScrollFeedLoading, globalResults, localResults, setGlobalResults, setLocalResults } = useFeed();

    const [searchValue, setSearchValue] = React.useState('');
    const [drafts, setDrafts] = React.useState<Map<string, Drafts>>(new Map());
    const [searchLoading, setSearchLoading] = React.useState(false);
    const [openSheet, setOpenSheet] = React.useState(false);

    const searchInputRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
        socket?.on(SocketEvents.CONVERSATION_CREATED, (conversation: ConversationFeed) => {
            setLocalResults((prevState) => [conversation, ...prevState]);
        })

        return () => {
            socket?.off(SocketEvents.CONVERSATION_CREATED);
        }
    }, [])

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

        trimmedValue.length > MIN_SEARCH_LENGTH && handleSearchDelay(trimmedValue);
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
        drafts,
        onScrollFeedLoading,
        searchValue,
        searchLoading,
        openSheet,
        searchInputRef,
        handleSearch,
        handleLogout,
        setOpenSheet,
        setLocalResults,
        setDrafts
    };
};