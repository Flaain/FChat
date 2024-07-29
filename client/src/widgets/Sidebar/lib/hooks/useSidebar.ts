import React from "react";
import { useSession } from "@/entities/session/lib/hooks/useSession";
import { SessionTypes } from "@/entities/session/model/types";
import { api } from "@/shared/api";
import { useProfile } from "@/shared/lib/hooks/useProfile";
import { ConversationFeed, FeedItem, FeedTypes, GroupFeed, UserFeed } from "@/shared/model/types";
import { debounce } from "@/shared/lib/utils/debounce";
import { useSidebarEvents } from "./useSidebarEvents";
import { toast } from "sonner";
import { getSortedFeedByLastMessage } from "@/shared/lib/utils/getSortedFeedByLastMessage";

const MIN_SEARCH_LENGTH = 3;

export const useSidebar = () => {
    const { setProfile } = useProfile();
    const { dispatch } = useSession();
    
    const [globalResults, setGlobalResults] = React.useState<Array<UserFeed | GroupFeed>>([]);
    const [localResults, setLocalResults] = React.useState<Array<ConversationFeed | GroupFeed>>([]);
    const [searchLoading, setSearchLoading] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState('');

    const trimmedSearchValue = searchValue.trim();

    const localFilters: Record<Exclude<FeedTypes, 'user'>, (item: FeedItem) => boolean> = {
        conversation: (item: FeedItem) => (item as ConversationFeed).recipient.name.toLowerCase().includes(trimmedSearchValue),
        group: (item: FeedItem) => (item as GroupFeed).name.toLowerCase().includes(trimmedSearchValue)
    };

    const globalFilters: Record<Exclude<FeedTypes, 'conversation'>, (item: FeedItem) => boolean> = {
        user: (item: FeedItem) => localResults.some((localItem) => localItem.type === FeedTypes.CONVERSATION && localItem.recipient._id === item._id),
        group: (item: FeedItem) => localResults.some((localItem) => localItem._id === item._id)
    };

    const filteredLocalResults = localResults.filter((item) => localFilters[item.type](item));
    const filteredGlobalResults = globalResults.filter((item) => !globalFilters[item.type](item));
    
    useSidebarEvents({ setLocalResults });
    
    const cursors = React.useRef<Record<string, string | null> | null>(null);

    React.useEffect(() => {
        (async () => {
            try {
                const [
                    { data: { conversations, nextCursor: nextConversationCursor } }
                    // { data: { groups, nextCursor: nextGroupCursor } }
                ] = await Promise.all([
                    api.conversation.getAll()
                    // api.group.getAll({ token: accessToken! })
                ]);

                setLocalResults(conversations.sort(getSortedFeedByLastMessage).map(({ participants, ...conversation }) => ({
                    type: FeedTypes.CONVERSATION,
                    recipient: participants[0],
                    ...conversation
                })));

                cursors.current = { nextConversationCursor };
            } catch (error) {
                console.error(error);
                error instanceof Error && toast.error(error.message);
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

        trimmedValue.length > MIN_SEARCH_LENGTH && handleSearchDelay(trimmedValue);
    }, []);

    const handleSearchDelay = React.useCallback(debounce(async (value: string) => {
        try {
            setSearchLoading(true);

            const { data: users } = await api.user.search({ query: value });

            setGlobalResults(users.map((user) => ({ ...user, type: FeedTypes.USER })));
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
        cursors,
        handleSearch,
        handleLogout,
        searchInputRef
    }
}