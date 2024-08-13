import AvatarByName from '@/shared/ui/AvatarByName';
import Typography from '@/shared/ui/Typography';
import { cn } from '@/shared/lib/utils/cn';
import { useSession } from '@/entities/session/lib/hooks/useSession';
import { Verified } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useLayoutContext } from '@/shared/lib/hooks/useLayoutContext';
import { FeedItemProps } from '../model/types';
import { FeedTypes } from '@/shared/model/types';

const FeedItem = ({ login, name, to, type, lastMessage, draftId, isOnline, isOfficial }: FeedItemProps) => {
    const { state: { userId } } = useSession();
    const { drafts } = useLayoutContext();

    const draft = draftId ? drafts.get(draftId) : undefined;

    return (
        <li>
            <NavLink
                state={{ name, isOfficial }}
                to={to}
                className={({ isActive }) =>
                    cn(
                        'flex items-center gap-5 p-2 rounded-lg transition-colors duration-200 ease-in-out',
                        isActive ? 'dark:bg-primary-dark-50 bg-primary-gray/10' : 'dark:hover:bg-primary-dark-50/30 hover:bg-primary-gray/5'
                    )
                }
            >
                <AvatarByName name={name} size='lg' isOnline={isOnline} />
                <div className='flex flex-col items-start w-full'>
                    <Typography as='h2' weight='medium' className={cn(isOfficial && 'flex items-center')}>
                        {name}
                        {isOfficial && (
                            <Typography className='ml-2'>
                                <Verified className='w-5 h-5' />
                            </Typography>
                        )}
                    </Typography>
                    {type === FeedTypes.USER ? (
                        <Typography variant='secondary'>@{login}</Typography>
                    ) : draft?.state === 'send' ? (
                        <Typography as='p' variant='secondary' className='line-clamp-1'>
                            <Typography as='span' variant='error'>
                                Draft:&nbsp;
                            </Typography>
                            {draft.value}
                        </Typography>
                    ) : (
                        !!lastMessage && (
                            <div className='flex items-center w-full gap-5'>
                                <Typography as='p' variant='secondary' className='line-clamp-1'>
                                    {lastMessage.sender._id === userId
                                        ? `You: ${lastMessage.text}`
                                        : type === FeedTypes.GROUP
                                        ? `${lastMessage.sender.name}: ${lastMessage.text}`
                                        : lastMessage.text}
                                </Typography>
                                <Typography className='ml-auto' variant='secondary'>
                                    {new Date(lastMessage.createdAt).toLocaleTimeString(navigator.language, {
                                        hour: 'numeric',
                                        minute: 'numeric'
                                    })}
                                </Typography>
                            </div>
                        )
                    )}
                </div>
            </NavLink>
        </li>
    );
};

export default FeedItem;