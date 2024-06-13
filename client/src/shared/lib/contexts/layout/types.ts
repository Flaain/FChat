import { ConversationFeed, Feed, GroupFeed, UserFeed } from '@/shared/model/types';

export interface LayoutContextProps {
    openSheet: boolean;
    setOpenSheet: React.Dispatch<React.SetStateAction<boolean>>;
    setLocalResults: React.Dispatch<React.SetStateAction<Array<ConversationFeed | GroupFeed>>>;
    searchValue: string;
    globalResults: Array<UserFeed | GroupFeed>;
    localResults: Array<ConversationFeed | GroupFeed>;
    searchLoading: boolean;
    handleSearch: (value: React.ChangeEvent<HTMLInputElement>) => void;
    handleLogout: () => void;
    searchInputRef: React.RefObject<HTMLInputElement>;
}