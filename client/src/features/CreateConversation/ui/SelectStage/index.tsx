import AvatarByName from '@/shared/ui/AvatarByName';
import Typography from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';
import { Minus, Plus, X } from 'lucide-react';
import { useCreateContext } from '../../lib/hooks/useCreateContext';

const SelectStage = () => {
    const { handleSelect, searchedUsers, selectedUsers, handleRemove } = useCreateContext();

    return (
        <>
            <Typography size='xl' weight='medium' as='h2' variant='primary'>
                Finded users
            </Typography>
            <ul className='flex flex-col gap-2 overflow-auto'>
                {searchedUsers.map((user) => {
                    const isSelected = selectedUsers.has(user._id);
                    return (
                        <li
                            key={user._id}
                            className='group searched-user focus-within:bg-primary-dark-50 flex items-center p-2 rounded-lg hover:bg-primary-dark-50 transition-colors duration-200 ease-in-out'
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
                                {isSelected ? <Minus className='w-5 h-5' /> : <Plus className='w-5 h-5' />}
                            </Button>
                        </li>
                    );
                })}
            </ul>
            {!!selectedUsers.size && (
                <>
                    <Typography size='xl' weight='medium' as='h2' variant='primary' className='mt-5 mb-2'>
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