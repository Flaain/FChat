import { Typography } from '@/shared/ui/Typography';
import { AvatarByName } from '@/shared/ui/AvatarByName';
import { SearchUserSkeleton } from '../Skeletons/SearchUserSkeleton';
import { Minus, Plus, UserSearch, X } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/Form';
import { Input } from '@/shared/ui/Input';
import { MIN_USER_SEARCH_LENGTH } from '@/shared/constants';
import { useModal } from '@/shared/lib/providers/modal';
import { MAX_GROUP_SIZE } from '../../model/constants';
import { useCreateGroup } from '../../model/context';

export const Select = () => {
    const { isModalDisabled } = useModal();
    const { form, handleSearchUser, handleSelect, handleRemove, searchedUsers, selectedUsers } = useCreateGroup();

    const searchQuery = form.getValues('username');
    const isResultsEmpty = searchQuery?.trim().length! > MIN_USER_SEARCH_LENGTH && !isModalDisabled && !searchedUsers.length;

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
                                {selectedUsers.size + 1} / {MAX_GROUP_SIZE}
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
            {isModalDisabled ? (
                <SearchUserSkeleton />
            ) : isResultsEmpty ? (
                <>
                    <UserSearch className='dark:text-primary-white w-10 h-10 self-center' />
                    <Typography as='p' variant='secondary' className='self-center text-center'>
                        There were no results for "{searchQuery}".
                    </Typography>
                </>
            ) : (
                !!searchedUsers.length && (
                    <>
                        <Typography size='xl' weight='medium' as='h2' variant='primary'>
                            Finded users
                        </Typography>
                        <ul className='flex flex-col gap-2 overflow-auto max-h-[300px]'>
                            {searchedUsers.map((user) => {
                                const isUserAlreadySelected = selectedUsers.has(user._id);
                                const isDisabled = selectedUsers.size + 1 === MAX_GROUP_SIZE && !isUserAlreadySelected;

                                return (
                                    <li
                                        key={user._id}
                                        className='group focus-within:bg-primary-dark-50 flex items-center gap-3 p-2 rounded-lg hover:bg-primary-dark-50 transition-colors duration-200 ease-in-out'
                                    >
                                        <AvatarByName name={user.name} />
                                        <div className='flex flex-col'>
                                            <Typography
                                                as='p'
                                                size='lg'
                                                variant='primary'
                                                weight='medium'
                                                className='line-clamp-1'
                                            >
                                                {user.name}
                                            </Typography>
                                            <Typography as='p' size='md' variant='secondary' className='line-clamp-1'>
                                                @{user.login}
                                            </Typography>
                                        </div>
                                        <Button
                                            type='button'
                                            disabled={isDisabled}
                                            onClick={() => handleSelect(user)}
                                            className='disabled:pointer-events-none min-w-[24px] max-w-[50px] h-[40px] rounded-lg opacity-0 focus:opacity-100 enabled:group-hover:opacity-100 ml-auto transition-opacity duration-200 ease-in-out'
                                        >
                                            {isUserAlreadySelected ? (
                                                <Minus className='w-5 h-5' />
                                            ) : (
                                                <Plus className='w-5 h-5' />
                                            )}
                                        </Button>
                                    </li>
                                );
                            })}
                        </ul>
                    </>
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
