import AvatarByName from '@/shared/ui/AvatarByName';
import Typography from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';
import { cn } from '@/shared/lib/utils/cn';
import { useProfile } from '@/shared/lib/hooks/useProfile';
import { useSettings } from '../../lib/hooks/useSettings';
import { LockKeyholeIcon, UserCircle2 } from 'lucide-react';
import Image from '@/shared/ui/Image';

const SettingsMain = () => {
    const { profile } = useProfile();
    const { onMenuChange } = useSettings();

    const list: Array<{ icon: React.ReactNode; title: string; action: () => void }> = [
        {
            title: 'My Account',
            icon: <UserCircle2 className='w-5 h-5' />,
            action: () => onMenuChange('myAccount')
        },
        {
            title: 'Privacy and Security',
            icon: <LockKeyholeIcon className='w-5 h-5' />,
            action: () => onMenuChange('privacy')
        }
    ];

    return (
        <>
            <div className='border-b-8 dark:border-b-primary-dark-50'>
                <div className='flex items-center gap-5 p-5'>
                    <Image
                        src={profile.avatar?.url}
                        skeleton={<AvatarByName name={profile.name} size='2xl' />}
                        className='object-cover size-16 rounded-full'
                    />
                    <div className='flex flex-col'>
                        <Typography
                            as='h2'
                            size='lg'
                            weight='medium'
                            className={cn(profile.isOfficial && 'flex items-center')}
                        >
                            {profile.name}
                        </Typography>
                        <Typography as='p' variant='primary'>
                            {profile.email}
                        </Typography>
                        <Typography as='p' variant='secondary'>
                            @{profile.login}
                        </Typography>
                    </div>
                </div>
            </div>
            <ul className='flex flex-col pt-2'>
                {list.map(({ title, icon, action }, index) => (
                    <li key={index}>
                        <Button
                            onClick={action}
                            variant='ghost'
                            className='px-5 flex items-center gap-4 justify-start w-full rounded-none'
                        >
                            {icon}
                            {title}
                        </Button>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default SettingsMain;