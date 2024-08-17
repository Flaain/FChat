import React from "react";
import { useSession } from "@/entities/session/lib/hooks/useSession";
import { SessionTypes } from "@/entities/session/model/types";
import { api } from "@/shared/api";
import { useProfile } from "@/shared/lib/hooks/useProfile";
import { ConversationFeed, FeedItem, FeedTypes, GroupFeed, Meta, UserFeed } from "@/shared/model/types";
import { debounce } from "@/shared/lib/utils/debounce";
import { useSidebarEvents } from "./useSidebarEvents";
import { MIN_USER_SEARCH_LENGTH } from "@/shared/constants";

export const useSidebar = () => {
    const { setProfile } = useProfile();
    const { dispatch } = useSession();
    
    const [globalResults, setGlobalResults] = React.useState<Array<UserFeed | GroupFeed>>([]);
    const [localResults, setLocalResults] = React.useState<Array<ConversationFeed | GroupFeed>>([]);
    const [searchLoading, setSearchLoading] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState('');

    const trimmedSearchValue = searchValue.trim().toLowerCase();
    const searchMeta = React.useRef<Meta | null>(null);

    const localFilters: Record<Exclude<FeedTypes, 'user'>, (item: FeedItem) => boolean> = {
        conversation: (item: FeedItem) =>
            (item as ConversationFeed).recipient.name.toLowerCase().includes(trimmedSearchValue) ||
            (item as ConversationFeed).recipient.login.toLowerCase().includes(trimmedSearchValue),
        group: (item: FeedItem) =>
            (item as GroupFeed).name.toLowerCase().includes(trimmedSearchValue) ||
            (item as GroupFeed).login.toLowerCase().includes(trimmedSearchValue)
    };

    const globalFilters: Record<Exclude<FeedTypes, 'conversation'>, (item: FeedItem) => boolean> = {
        user: (item: FeedItem) => localResults.some((localItem) => localItem.type === FeedTypes.CONVERSATION && localItem.recipient._id === item._id),
        group: (item: FeedItem) => localResults.some((localItem) => localItem._id === item._id)
    };

    const filteredLocalResults = localResults.filter((item) => localFilters[item.type](item));
    const filteredGlobalResults = globalResults.filter((item) => !globalFilters[item.type](item));
    
    useSidebarEvents({ setLocalResults });
    
    React.useEffect(() => {
        (async () => {
            try {
                const { data } = await api.feed.get();

                setLocalResults(data.feed);
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    const searchInputRef = React.useRef<HTMLInputElement | null>(null);

    const handleLogout = React.useCallback(async () => {
        await api.user.logout();

        setProfile(undefined!);
        dispatch({ type: SessionTypes.SET_ON_LOGOUT });
    }, []);

    const handleSearch = React.useCallback(({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        if (!value) {
            setSearchValue('');
            setGlobalResults([]);
            return;
        }

        const trimmedValue = value.trim();

        setSearchValue(!trimmedValue.length ? '' : value);

        if(trimmedValue.length > MIN_USER_SEARCH_LENGTH) {
            setSearchLoading(true);
            handleSearchDelay(trimmedValue);
        }
    }, []);

    const handleSearchDelay = React.useCallback(debounce(async (value: string) => {
        try {
            const { data: { items, ...rest } } = await api.feed.search({ query: value });

            searchMeta.current = rest;

            setGlobalResults(items);
        } catch (error) {
            console.error(error);
            setGlobalResults([]);
        } finally {
            setSearchLoading(false);
        }
    }, 500), []);

    return {
        feed: {
            filteredLocalResults,
            filteredGlobalResults,
            isFeedEmpty: !trimmedSearchValue.length && !localResults.length && !globalResults.length,
            searchValue,
            searchLoading,
        },
        handleSearch,
        handleLogout,
        searchInputRef
    }
}