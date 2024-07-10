import AvatarByName from '@/shared/ui/AvatarByName';
import Typography from '@/shared/ui/Typography';
import { cn } from '@/shared/lib/utils/cn';
import { useSession } from '@/entities/session/lib/hooks/useSession';
import { ConversationFeed } from '@/shared/model/types';
import { Verified } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useLayoutContext } from '@/shared/lib/hooks/useLayoutContext';

const ConversationItem = ({ conversation }: { conversation: ConversationFeed }) => {
    const { state: { userId } } = useSession();
    const { drafts } = useLayoutContext();

    const draft = drafts.get(conversation.recipient._id);

    return (
        <li>
            <NavLink
                to={`conversation/${conversation.recipient._id}`}
                className={({ isActive }) =>
                    cn(
                        'flex items-center gap-5 p-2 rounded-lg transition-colors duration-200 ease-in-out',
                        isActive && 'dark:bg-primary-dark-50 bg-primary-gray/10',
                        !isActive && 'dark:hover:bg-primary-dark-50/30 hover:bg-primary-gray/5'
                    )
                }
            >
                <AvatarByName name={conversation.recipient.name} size='lg' />
                <div className='flex flex-col items-start w-full'>
                    <Typography
                        as='h2'
                        weight='medium'
                        className={cn(conversation.recipient.isVerified && 'flex items-center')}
                    >
                        {conversation.recipient.name}
                        {conversation.recipient.isVerified && (
                            <Typography className='ml-2'>
                                <Verified className='w-5 h-5' />
                            </Typography>
                        )}
                    </Typography>
                    {draft?.state === 'send' ? (
                        <Typography as='p' variant='secondary' className='line-clamp-1'>
                            <Typography as='span' variant='error'>
                                Draft:&nbsp;
                            </Typography>
                            {draft.value}
                        </Typography>
                    ) : (
                        !!conversation.lastMessage && (
                            <div className='flex items-center w-full gap-5'>
                                <Typography as='p' variant='secondary' className='line-clamp-1'>
                                    {conversation.lastMessage.sender._id === userId
                                        ? `You: ${conversation.lastMessage.text}`
                                        : conversation.lastMessage.text}
                                </Typography>
                                <Typography className='ml-auto' variant='secondary'>
                                    {new Date(conversation.lastMessage.createdAt).toLocaleTimeString(
                                        navigator.language,
                                        {
                                            hour: 'numeric',
                                            minute: 'numeric'
                                        }
                                    )}
                                </Typography>
                            </div>
                        )
                    )}
                </div>
            </NavLink>
        </li>
    );
};

export default ConversationItem;