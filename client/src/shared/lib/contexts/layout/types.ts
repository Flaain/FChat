import { Drafts, ConversationFeed, GroupFeed, UserFeed } from '@/shared/model/types';
import { Socket } from 'socket.io-client';

export interface LayoutContextProps {
    openSheet: boolean;
    socket: Socket | null;
    isConnected: boolean;
    setOpenSheet: React.Dispatch<React.SetStateAction<boolean>>;
    setLocalResults: React.Dispatch<React.SetStateAction<Array<ConversationFeed | GroupFeed>>>;
    searchValue: string;
    drafts: Map<string, Drafts>;
    setDrafts: React.Dispatch<React.SetStateAction<Map<string, Drafts>>>;
    globalResults: Array<UserFeed | GroupFeed>;
    localResults: Array<ConversationFeed | GroupFeed>;
    searchLoading: boolean;
    handleSearch: (value: React.ChangeEvent<HTMLInputElement>) => void;
    handleLogout: () => void;
    searchInputRef: React.RefObject<HTMLInputElement>;
}