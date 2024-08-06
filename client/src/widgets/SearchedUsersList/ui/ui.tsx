import Typography from '@/shared/ui/Typography';
import AvatarByName from '@/shared/ui/AvatarByName';
import { Button } from '@/shared/ui/Button';
import { Minus, Plus } from 'lucide-react';
import { SearchedUsersListProps } from '../model/types';

const SearchedUsersList = ({ searchedUsers, selectedUsers, onUserSelect, title, ...rest }: SearchedUsersListProps) => {
    return (
        <>
            <Typography size='xl' weight='medium' as='h2' variant='primary'>
                {title}
            </Typography>
            <ul {...rest} className='flex flex-col gap-2 overflow-auto max-h-[300px]'>
                {searchedUsers.map((user) => {
                    const isUserAlreadySelected = selectedUsers.has(user._id);

                    return (
                        <li
                            key={user._id}
                            className='group focus-within:bg-primary-dark-50 flex items-center gap-3 p-2 rounded-lg hover:bg-primary-dark-50 transition-colors duration-200 ease-in-out'
                        >
                            <AvatarByName name={user.name} />
                            <div className='flex flex-col'>
                                <Typography as='p' size='lg' variant='primary' weight='medium' className='line-clamp-1'>
                                    {user.name}
                                </Typography>
                                <Typography as='p' size='md' variant='secondary' className='line-clamp-1'>
                                    @{user.login}
                                </Typography>
                            </div>
                            <Button
                                type='button'
                                onClick={() => onUserSelect(user)}
                                className='min-w-[24px] max-w-[50px] h-[40px] rounded-lg opacity-0 focus:opacity-100 group-hover:opacity-100 ml-auto transition-opacity duration-200 ease-in-out'
                            >
                                {isUserAlreadySelected ? <Minus className='w-5 h-5' /> : <Plus className='w-5 h-5' />}
                            </Button>
                        </li>
                    );
                })}
            </ul>
        </>
    );
};

export default SearchedUsersList;
