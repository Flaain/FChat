import Typography from '@/shared/ui/Typography';
import SearchedUsersList from '@/widgets/SearchedUsersList/ui/ui';
import SearchUserSkeleton from '@/widgets/SearchedUsersList/ui/Skeletons/SearchUserSkeleton';
import { UserSearch, X } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/Form';
import { Input } from '@/shared/ui/Input';
import { useCreateGroupContext } from '../../lib/hooks/useCreateGroupContext';
import { useModal } from '@/shared/lib/hooks/useModal';

const MAX_CONVERSATION_SIZE = 10;

const SelectStage = () => {
    const { isAsyncActionLoading } = useModal();
    const { selectedUsers, searchedUsers, form, handleSearchUser, handleSelect, handleRemove } = useCreateGroupContext();

    const searchQuery = form.getValues('username');
    const isResultsEmpty = searchQuery?.trim().length! > 2 && !isAsyncActionLoading && !searchedUsers.length;

    return (
        <>
            <FormField
                name='username'
                control={form.control}
                rules={{ onChange: handleSearchUser }}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className='text-white'>
                            Add Members&nbsp;
                            <Typography as='sup' variant='secondary' className='ml-1 text-xs'>
                                {selectedUsers.size + 1} / {MAX_CONVERSATION_SIZE}
                            </Typography>
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                placeholder='Search'
                                className='focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300 placeholder:ease-in-out dark:ring-offset-0 dark:focus-visible:ring-primary-dark-50 dark:focus:bg-primary-dark-200 dark:bg-primary-dark-100 border-none text-white ring-1 dark:placeholder:text-white placeholder:opacity-50 dark:ring-primary-dark-50'
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            {isResultsEmpty ? (
                <>
                    <UserSearch className='dark:text-primary-white w-10 h-10 self-center' />
                    <Typography as='p' variant='secondary' className='self-center text-center'>
                        There were no results for "{searchQuery}".
                    </Typography>
                </>
            ) : isAsyncActionLoading ? (
                <SearchUserSkeleton />
            ) : (
                !!searchedUsers.length && (
                    <SearchedUsersList
                        title='Finded users'
                        onUserSelect={handleSelect}
                        searchedUsers={searchedUsers}
                        selectedUsers={selectedUsers}
                    />
                )
            )}
            {!!selectedUsers.size && (
                <>
                    <Typography size='xl' weight='medium' as='h2' variant='primary'>
                        Selected users
                    </Typography>
                    <ul className='flex items-center gap-2 flex-wrap overflow-auto'>
                        {[...selectedUsers.values()].map((user) => (
                            <li
                                key={user._id}
                                className='max-w-[300px] gap-5 flex items-center px-3 py-2 rounded-lg bg-primary-dark-200'
                            >
                                <Typography as='p' size='lg' variant='primary' weight='medium' className='line-clamp-1'>
                                    {user.name}
                                </Typography>
                                <Button
                                    variant='secondary'
                                    size='icon'
                                    type='button'
                                    onClick={() => handleRemove(user._id)}
                                    className='w-5 h-5 ml-auto transition-opacity rounded-md duration-200 ease-in-out'
                                >
                                    <X className='w-4 h-4 pointer-events-none' />
                                </Button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </>
    );
};

export default SelectStage;