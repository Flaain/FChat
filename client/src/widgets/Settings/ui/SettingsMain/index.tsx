import { AvatarByName } from '@/shared/ui/AvatarByName';
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';
import { cn } from '@/shared/lib/utils/cn';
import { LockKeyholeIcon, UserCircle2 } from 'lucide-react';
import { Image } from '@/shared/ui/Image';
import { useSettings } from '../../model/context';
import { useProfile } from '@/entities/profile';

export const SettingsMain = () => {
    const { profile } = useProfile();
    const { onMenuChange } = useSettings();

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
                <li>
                    <Button
                        onClick={() => onMenuChange('myAccount')}
                        variant='ghost'
                        className='px-5 flex items-center gap-4 justify-start w-full rounded-none'
                    >
                        <UserCircle2 className='w-5 h-5' />
                        My Account
                    </Button>
                </li>
                <li>
                    <Button
                        onClick={() => onMenuChange('privacy')}
                        variant='ghost'
                        className='px-5 flex items-center gap-4 justify-start w-full rounded-none'
                    >
                        <LockKeyholeIcon className='w-5 h-5' />
                        Privacy and Security
                    </Button>
                </li>
            </ul>
        </>
    );
};