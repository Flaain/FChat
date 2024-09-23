import { AvatarByName } from '@/shared/ui/AvatarByName';
import { Typography } from '@/shared/ui/Typography';
import { cn } from '@/shared/lib/utils/cn';
import { Verified } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { PRESENCE, UserFeed } from '@/shared/model/types';
import { useLayout } from '@/shared/lib/providers/layout/context';

const UserItem = ({ user }: { user: UserFeed }) => {
    const { drafts } = useLayout();

    const draft = drafts.get(user._id);

    return (
        <li>
            <NavLink
                state={user}
                to={`/conversation/${user._id}`}
                className={({ isActive }) =>
                    cn(
                        'flex items-center gap-5 p-2 rounded-lg transition-colors duration-200 ease-in-out',
                        isActive
                            ? 'dark:bg-primary-dark-50 bg-primary-gray/10'
                            : 'dark:hover:bg-primary-dark-50/30 hover:bg-primary-gray/5'
                    )
                }
            >
                <AvatarByName name={user.name} size='lg' isOnline={user.presence === PRESENCE.ONLINE} />
                <div className='flex flex-col items-start w-full'>
                    <Typography as='h2' weight='medium' className={cn(user.isOfficial && 'flex items-center')}>
                        {user.name}
                        {user.isOfficial && (
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
                        <Typography variant='secondary'>@{user.login}</Typography>
                    )}
                </div>
            </NavLink>
        </li>
    );
};

export default UserItem;