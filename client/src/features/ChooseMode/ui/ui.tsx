import Typography from '@/shared/ui/Typography';
import { Input } from '@/shared/ui/Input';
import { MessageCircle, Users } from 'lucide-react';
import { CreateChatType } from '@/widgets/CreateChatContainer/model/types';
import { useCreateChatContainer } from '@/widgets/CreateChatContainer/lib/hooks/useCreateChatContainer';

const ChooseMode = () => {
    const { type, handleTypeChange } = useCreateChatContainer();

    return (
        <ul className='flex flex-col gap-4'>
            <li>
                <label className='cursor-pointer flex gap-4 items-center p-5 rounded-lg border border-solid border-primary-dark-50 hover:border-primary-white/50 transition-colors ease-in-out duration-200'>
                    <Users className='w-8 h-8 dark:text-primary-white text-primary-dark-200' />
                    <Typography as='h2' size='lg' weight='medium'>
                        Create group
                    </Typography>
                    <Input
                        type='radio'
                        name='type'
                        value='group'
                        checked={type === 'group'}
                        onChange={({ target: { value } }) => handleTypeChange(value as CreateChatType)}
                        className='sr-only'
                    />
                </label>
            </li>
            <li>
                <label className='cursor-pointer flex gap-4 p-5 rounded-lg border border-solid border-primary-dark-50 hover:border-primary-white/50 transition-colors ease-in-out duration-200'>
                    <MessageCircle className='w-8 h-8 dark:text-primary-white text-primary-dark-200' />
                    <Typography as='h2' size='lg' weight='medium'>
                        Create private conversation
                    </Typography>
                    <Input
                        type='radio'
                        name='type'
                        value='private'
                        checked={type === 'private'}
                        onChange={({ target: { value } }) => handleTypeChange(value as CreateChatType)}
                        className='sr-only'
                    />
                </label>
            </li>
        </ul>
    );
};

export default ChooseMode;