import Typography from '@/shared/ui/Typography';
import AvatarByName from '@/shared/ui/AvatarByName';
import SearchUserSkeleton from '@/shared/ui/Skeletons/SearchUserSkeleton';
import { useModal } from '@/shared/lib/hooks/useModal';
import { Button } from '@/shared/ui/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/Form';
import { Input } from '@/shared/ui/Input';
import { LoaderCircle, Minus, Plus, X } from 'lucide-react';
import { useCreateConversation } from '../lib/hooks/useCreateConversation';
import { useCreateChatContainer } from '@/widgets/CreateChatContainer/lib/hooks/useCreateChatContainer';

const CreateConversation = () => {
    const { isAsyncActionLoading } = useModal();
    const { handleTypeChange } = useCreateChatContainer();
    const {
        form,
        selectedUser,
        searchedUsers,
        isSubmitButtonDisabled,
        handleSubmit,
        handleSearchUser,
        setSelectedUser
    } = useCreateConversation();

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
                <FormField
                    name='username'
                    rules={{ onChange: handleSearchUser }}
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-white'>User name</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder='Enter user name'
                                    className='box-border focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300 placeholder:ease-in-out dark:ring-offset-0 dark:focus-visible:ring-primary-dark-50 dark:focus:bg-primary-dark-200 dark:bg-primary-dark-100 border-none text-white ring-1 dark:placeholder:text-white placeholder:opacity-50 dark:ring-primary-dark-50'
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
                                            onClick={() =>
                                                setSelectedUser(selectedUser?._id === user._id ? null : user)
                                            }
                                            className='opacity-0 focus:opacity-100 group-hover:opacity-100 ml-auto transition-opacity duration-200 ease-in-out'
                                        >
                                            {selectedUser?._id === user._id ? (
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
                {!!selectedUser && (
                    <>
                        <Typography size='xl' weight='medium' as='h2' variant='primary' className='mt-5'>
                            Selected user
                        </Typography>
                        <div className='w-full max-w-[150px] gap-5 flex items-center px-3 py-2 rounded-lg bg-primary-dark-200'>
                            <Typography className='line-clamp-1' as='p' size='lg' variant='primary' weight='medium'>
                                {selectedUser.name}
                            </Typography>
                            <Button
                                variant='secondary'
                                size='icon'
                                type='button'
                                onClick={() => setSelectedUser(null)}
                                className='w-5 h-5 ml-auto transition-opacity rounded-md duration-200 ease-in-out'
                            >
                                <X className='w-4 h-4' />
                            </Button>
                        </div>
                    </>
                )}
                <div className='flex items-center gap-5 justify-between'>
                    <Button
                        type='button'
                        size='lg'
                        variant='secondary'
                        className='w-1/3'
                        onClick={() => handleTypeChange('choose')}
                        disabled={isAsyncActionLoading}
                    >
                        Back
                    </Button>
                    <Button type='submit' className='w-full' disabled={isSubmitButtonDisabled}>
                        {isAsyncActionLoading ? (
                            <LoaderCircle className='w-5 h-5 animate-loading' />
                        ) : (
                            'Create conversation'
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default CreateConversation;