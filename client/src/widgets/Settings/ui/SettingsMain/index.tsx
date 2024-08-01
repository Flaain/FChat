import AvatarByName from "@/shared/ui/AvatarByName";
import Typography from "@/shared/ui/Typography";
import { Button } from "@/shared/ui/Button";
import { cn } from "@/shared/lib/utils/cn";
import { useProfile } from "@/shared/lib/hooks/useProfile";
import { useSettings } from "../../lib/hooks/useSettings";
import { LockKeyholeIcon } from "lucide-react";

const SettingsMain = () => {
    const { profile } = useProfile();
    const { onMenuChange } = useSettings();
    
    const list: Array<{ icon: React.ReactNode; title: string; action: () => void }> = [
        {
            title: 'Privacy and Security',
            icon: <LockKeyholeIcon className='w-5 h-5' />,
            action: () => onMenuChange('privacy')
        }
    ];

    return (
        <>
            <div className='border-b-8 dark:border-b-primary-dark-50'>
                <div className='flex items-center gap-5 px-5 pb-5'>
                    <AvatarByName name={profile.name} size='2xl' />
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
            <div className='border-b-8 dark:border-b-primary-dark-50 py-2'>
                <ul className='flex flex-col gap-2'>
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
            </div>
        </>
    );
};

export default SettingsMain;