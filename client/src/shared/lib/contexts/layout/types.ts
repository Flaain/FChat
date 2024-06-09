import { Feed } from "@/shared/model/types";

export interface LayoutContextProps {
    openSheet: boolean;
    setOpenSheet: React.Dispatch<React.SetStateAction<boolean>>;
    searchValue: string;
    feed: Feed
    searchLoading: boolean;
    handleSearch: (value: React.ChangeEvent<HTMLInputElement>) => void;
    handleLogout: () => void;
    searchInputRef: React.RefObject<HTMLInputElement>;
}