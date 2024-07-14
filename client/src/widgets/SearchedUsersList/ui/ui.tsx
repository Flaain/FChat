import Typography from "@/shared/ui/Typography";
import AvatarByName from "@/shared/ui/AvatarByName";
import SearchUserSkeleton from "../ui/Skeletons/SearchUserSkeleton";
import { useModal } from "@/shared/lib/hooks/useModal";
import { Button } from "@/shared/ui/Button";
import { Minus, Plus } from "lucide-react";
import { SearchedUsersListProps } from "../model/types";


const SearchedUsersList = ({ searchedUsers, selectedUsers, onUserSelect, title, ...rest }: SearchedUsersListProps) => {
    const { isAsyncActionLoading } = useModal();
    
    return (
        <>
            {title && (
                <Typography size='xl' weight='medium' as='h2' variant='primary'>
                    {title}
                </Typography>
            )}
            {isAsyncActionLoading ? (
                <SearchUserSkeleton />
            ) : (
                <ul {...rest} className='flex flex-col gap-2 overflow-auto max-h-[300px]'>
                    {searchedUsers.map((user) => {
                        const isUserAlreadySelected = selectedUsers.has(user._id)

                        return (
                            <li
                                key={user._id}
                                className='group focus-within:bg-primary-dark-50 flex items-center p-2 rounded-lg hover:bg-primary-dark-50 transition-colors duration-200 ease-in-out'
                            >
                                <AvatarByName name={user.name} />
                                <Typography as='p' size='lg' variant='primary' weight='medium' className='ml-3'>
                                    {user.name}
                                </Typography>
                                <Button
                                    size='icon'
                                    type='button'
                                    onClick={() => onUserSelect(user)}
                                    className='opacity-0 focus:opacity-100 group-hover:opacity-100 ml-auto transition-opacity duration-200 ease-in-out'
                                >
                                    {isUserAlreadySelected ? <Minus className='w-5 h-5' /> : <Plus className='w-5 h-5' />}
                                </Button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </>
    );
};

export default SearchedUsersList;