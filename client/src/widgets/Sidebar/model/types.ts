import { ConversationFeed, GroupFeed, Meta, UserFeed } from "@/shared/model/types";

export interface SidebarAnouncement {
    title: string;
    description: string;
    icon?: React.ReactNode;
}

export interface UseSidebarEventsProps {
    setLocalResults: React.Dispatch<React.SetStateAction<Array<ConversationFeed | GroupFeed>>>;
}

export interface LocalResults {
    feed: Array<ConversationFeed | GroupFeed>;
    nextCursor: string | null;
}

export interface SidebarStore {
    localResults: LocalResults;
    globalResults: Meta<Array<UserFeed | GroupFeed>> | null;
    localResultsError: string | null;
    searchRef: React.RefObject<HTMLInputElement>;
    isSearching: boolean;
    searchValue: string;
    actions: {
        resetSearch: () => void;
        handleLogout: () => Promise<void>;
        handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
        delayedSearch: (value: string) => void;
        updateFeed: (update: Pick<ConversationFeed | GroupFeed, 'lastMessage' | 'lastActionAt'>, id: string, sort?: boolean) => void;
        getFeed: () => Promise<void>;
    }
}