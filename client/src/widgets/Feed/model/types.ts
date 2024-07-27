import { ConversationFeed, GroupFeed, UserFeed } from "@/shared/model/types";

export interface FeedProps {
    isFeedEmpty: boolean;
    filteredLocalResults: Array<ConversationFeed | GroupFeed>;
    filteredGlobalResults: Array<ConversationFeed | GroupFeed | UserFeed>;
    searchLoading: boolean;
    searchValue: string;
}