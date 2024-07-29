import AvatarByName from '@/shared/ui/AvatarByName';
import Typography from '@/shared/ui/Typography';
import { cn } from '@/shared/lib/utils/cn';
import { UserFeed } from '@/shared/model/types';
import { Verified } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const UserItem = ({ user }: { user: UserFeed }) => {
    return (
        <li>
            <NavLink
                to={`conversation/${user._id}`}
                className={({ isActive }) =>
                    cn(
                        'flex items-center gap-5 p-2 rounded-lg dark:hover:bg-primary-dark-50 transition-colors duration-200 ease-in-out',
                        isActive && 'bg-primary-dark-50'
                    )
                }
            >
                <AvatarByName name={user.name} size='lg' />
                <Typography as='h2' weight='medium' className={cn(user.isOfficial && 'flex items-center')}>
                    {user.name}
                    {user.isOfficial && (
                        <Typography className='ml-2'>
                            <Verified className='w-5 h-5' />
                        </Typography>
                    )}
                </Typography>
            </NavLink>
        </li>
    );
};

export default UserItem;