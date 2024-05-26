import AvatarByName from '@/shared/ui/AvatarByName';
import Typography from '@/shared/ui/Typography';
import SearchUserSkeleton from '@/shared/ui/Skeletons/SearchUserSkeleton';
import { Button } from '@/shared/ui/Button';
import { Minus, Plus, X } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/Form';
import { Input } from '@/shared/ui/Input';
import { UseFormReturn } from 'react-hook-form';
import { CreateGroupType } from '../../model/types';
import { useCreateGroupContext } from '../../lib/hooks/useCreateGroupContext';
import { useModal } from '@/shared/lib/hooks/useModal';

const MAX_CONVERSATION_SIZE = 10;

const SelectStage = ({
    form,
    handleSearchUser
}: {
    form: UseFormReturn<CreateGroupType>;
    handleSearchUser: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
    const { isAsyncActionLoading } = useModal();
    const { handleSelect, searchedUsers, selectedUsers, handleRemove } = useCreateGroupContext();

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
                            <Typography variant='secondary' size='sm'>
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
            {isAsyncActionLoading ? (
                <SearchUserSkeleton />
            ) : (
                !!searchedUsers.length && (
                    <>
                        <Typography size='xl' weight='medium' as='h2' variant='primary'>
                            Finded users
                        </Typography>

                        <ul className='flex flex-col gap-2 overflow-auto max-h-[300px]'>
                            {searchedUsers.map((user) => (
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
                                        onClick={() => handleSelect(user)}
                                        className='opacity-0 focus:opacity-100 group-hover:opacity-100 ml-auto transition-opacity duration-200 ease-in-out'
                                    >
                                        {selectedUsers.has(user._id) ? (
                                            <Minus className='w-5 h-5' />
                                        ) : (
                                            <Plus className='w-5 h-5' />
                                        )}
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </>
                )
            )}
            {!!selectedUsers.size && (
                <>
                    <Typography size='xl' weight='medium' as='h2' variant='primary' className='mt-5'>
                        Selected users
                    </Typography>
                    <ul className='flex items-center gap-2 flex-wrap overflow-auto'>
                        {[...selectedUsers.values()].map((user) => (
                            <li
                                key={user._id}
                                className='max-w-[300px] gap-5 flex items-center px-3 py-2 rounded-lg bg-primary-dark-200'
                            >
                                <Typography as='p' size='lg' variant='primary' weight='medium'>
                                    {user.name}
                                </Typography>
                                <Button
                                    variant='secondary'
                                    size='icon'
                                    type='button'
                                    onClick={() => handleRemove(user._id)}
                                    className='w-5 h-5 ml-auto transition-opacity rounded-md duration-200 ease-in-out'
                                >
                                    <X className='w-4 h-4' />
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