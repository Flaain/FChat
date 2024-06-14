import Switch from '@/shared/ui/Switch';
import Typography from '@/shared/ui/Typography';
import AvatarByName from '@/shared/ui/AvatarByName';
import CreateGroup from '@/features/CreateGroup/ui/ui';
import { useTheme } from '@/entities/theme/lib/hooks/useTheme';
import { useModal } from '@/shared/lib/hooks/useModal';
import { useProfile } from '@/shared/lib/hooks/useProfile';
import { Button } from '@/shared/ui/Button';
import { Archive, Moon, Settings, Users, Verified } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/shared/lib/utils/cn';

const listIconStyle = 'dark:text-primary-white text-primary-dark-200 w-5 h-5';

const LayoutSheet = ({ setSheetOpen }: { setSheetOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const { profile } = useProfile();
    const { openModal } = useModal();
    const { setTheme, theme } = useTheme();

    const onCreateGroup = () => {
        setSheetOpen(false);
        openModal({
            title: 'Create group',
            content: <CreateGroup />,
            size: 'fitHeight'
        });
    };

    const sheetList: Array<{ title: string; icon: JSX.Element; action: () => void }> = [
        {
            title: 'Archived chats',
            icon: <Archive className={listIconStyle} />,
            action: () => toast.info('Not implemented')
        },
        {
            title: 'New group',
            icon: <Users className={listIconStyle} />,
            action: onCreateGroup
        },
        {
            title: 'Settings',
            icon: <Settings className={listIconStyle} />,
            action: () => toast.info('Settings')
        }
    ];

    return (
        <div className='flex flex-col py-8 h-full'>
            <div className='flex flex-col gap-2 items-start px-4'>
                <AvatarByName name={profile.name} size='lg' />
                <Typography as='h2' size='lg' weight='medium' className={cn(profile.isVerified && 'flex items-center')}>
                    {profile.name}
                    {profile.isVerified && (
                        <Typography className='ml-2'>
                            <Verified className='w-5 h-5' />
                        </Typography>
                    )}
                </Typography>
            </div>
            <ul className='flex flex-col gap-2'>
                {sheetList.map(({ title, icon, action }) => (
                    <li
                        key={title}
                        className='first:my-4 first:py-1 first:border-y dark:first:border-primary-dark-50 first:border-primary-dark-200'
                    >
                        <Button
                            variant='ghost'
                            onClick={action}
                            className='rounded-none flex items-center justify-start gap-4 w-full'
                        >
                            {icon}
                            <Typography weight='medium'>{title}</Typography>
                        </Button>
                    </li>
                ))}
                <li className='flex items-center'>
                    <Switch onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} checked={theme === 'dark'}>
                        <Moon className={listIconStyle} />
                        <Typography weight='medium'>Night Mode</Typography>
                    </Switch>
                </li>
            </ul>
            <Typography as='p' variant='secondary' className='mt-auto px-4'>
                FChat Web, {new Date().getFullYear()}
            </Typography>
        </div>
    );
};

export default LayoutSheet;