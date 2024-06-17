import AvatarByName from '@/shared/ui/AvatarByName';
import Typography from '@/shared/ui/Typography';
import { cn } from '@/shared/lib/utils/cn';
import { useSession } from '@/entities/session/lib/hooks/useSession';
import { ConversationFeed } from '@/shared/model/types';
import { Verified } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const ConversationItem = ({ conversation }: { conversation: ConversationFeed }) => {
    const { state: { userId } } = useSession();

    const recipient = conversation.participants[0];
    const lastMessageDescription = conversation.lastMessage && `${conversation.lastMessage.sender._id === userId ? 'You: ' : ''}`;

    return (
        <li>
            <NavLink
                to={`conversation/${recipient._id}`}
                className={({ isActive }) =>
                    cn(
                        'flex items-center gap-5 p-2 rounded-lg transition-colors duration-200 ease-in-out',
                        isActive && 'dark:bg-primary-dark-50 bg-primary-gray/10',
                        !isActive && 'dark:hover:bg-primary-dark-50/30 hover:bg-primary-gray/5'
                    )
                }
            >
                <AvatarByName name={recipient.name} size='lg' />
                <div className='flex flex-col items-start w-full'>
                    <Typography
                        as='h2'
                        weight='medium'
                        className={cn(recipient.isVerified && 'flex items-center')}
                    >
                        {recipient.name}
                        {recipient.isVerified && (
                            <Typography className='ml-2'>
                                <Verified className='w-5 h-5' />
                            </Typography>
                        )}
                    </Typography>
                    {!!conversation.lastMessage && (
                        <div className='flex items-center w-full gap-5'>
                            <Typography as='p' variant='secondary' className='line-clamp-1'>
                                {lastMessageDescription}
                                {conversation.lastMessage.text}
                            </Typography>
                            <Typography className='ml-auto' variant='secondary'>
                                {new Date(conversation.lastMessage.createdAt).toLocaleTimeString(navigator.language, {
                                    hour: 'numeric',
                                    minute: 'numeric'
                                })}
                            </Typography>
                        </div>
                    )}
                </div>
            </NavLink>
        </li>
    );
};

export default ConversationItem;