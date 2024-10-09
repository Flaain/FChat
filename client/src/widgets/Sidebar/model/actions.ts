import { SetStateInternal } from "zustand";
import { SidebarStore } from "./types";
import { sessionAPI, useSession } from "@/entities/session";
import { debounce } from "@/shared/lib/utils/debounce";
import { MIN_USER_SEARCH_LENGTH } from "@/shared/constants";
import { sidebarAPI } from "../api";
import { AppException } from "@/shared/api/error";
import { ConversationFeed, GroupFeed } from "@/shared/model/types";
import { getSortedFeedByLastMessage } from "@/shared/lib/utils/getSortedFeedByLastMessage";

export const sidebarActions = (set: SetStateInternal<SidebarStore>, get: () => SidebarStore): SidebarStore['actions'] => ({
    handleLogout: async () => {
        await sessionAPI.logout();
        useSession.getState().actions.onSignout();
    },
    getFeed: async () => {
        try {
            const { data } = await sidebarAPI.get();

            set({ localResults: data });
        } catch (error) {
            console.error(error);
            set({ localResultsError: error instanceof AppException ? error.message : 'Failed to load feed' });
        }
    },
    resetSearch: () => {
        set({ searchValue: '', globalResults: null });
        get().searchRef?.current?.focus();
    },
    handleSearch: ({ target: { value } }) => {
        if (!value) return set({ searchValue: '', globalResults: null });
        
        const trimmedSearchValue = value.trim();
        
        set({ searchValue: trimmedSearchValue });

        if (trimmedSearchValue.length > MIN_USER_SEARCH_LENGTH) {
            set({ isSearching: true });
            get().actions.delayedSearch(trimmedSearchValue);
        }
    },
    delayedSearch: debounce(async (value: string) => {
        try {
            const { data } = await sidebarAPI.search({ query: value });

            set({ globalResults: data });
        } catch (error) {
            console.error(error);
            set({ globalResults: null });
        } finally {
            set({ isSearching: false });
        }
    }, 500),
    updateFeed: (update: Pick<ConversationFeed | GroupFeed, 'lastMessage' | 'lastActionAt'>, id: string, sort?: boolean) => {
        set((prevState) => {
            const updatedArray = prevState.localResults.feed.map((item) => item._id === id ? { ...item, ...update } : item);

            return { localResults: { ...prevState.localResults, feed: sort ? updatedArray.sort(getSortedFeedByLastMessage) : updatedArray } };
        })
    }
})