import { SearchUser } from "@/shared/model/types";

export interface SearchedUsersListProps extends React.HTMLAttributes<HTMLUListElement> {
    onUserSelect: (user: SearchUser) => void;
    searchedUsers: Array<SearchUser>;
    selectedUsers: Map<string, SearchUser>;
    title?: string;
}