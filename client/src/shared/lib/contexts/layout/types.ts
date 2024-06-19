import { ConversationDrafts, ConversationFeed, GroupFeed, UserFeed } from '@/shared/model/types';

export interface LayoutContextProps {
    openSheet: boolean;
    setOpenSheet: React.Dispatch<React.SetStateAction<boolean>>;
    setLocalResults: React.Dispatch<React.SetStateAction<Array<ConversationFeed | GroupFeed>>>;
    searchValue: string;
    conversationDrafts: Map<string, ConversationDrafts>;
    setConversationDrafts: React.Dispatch<React.SetStateAction<Map<string, ConversationDrafts>>>;
    globalResults: Array<UserFeed | GroupFeed>;
    localResults: Array<ConversationFeed | GroupFeed>;
    searchLoading: boolean;
    handleSearch: (value: React.ChangeEvent<HTMLInputElement>) => void;
    handleLogout: () => void;
    searchInputRef: React.RefObject<HTMLInputElement>;
}