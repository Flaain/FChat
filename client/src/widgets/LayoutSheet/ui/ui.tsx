import Switch from '@/shared/ui/Switch';
import Typography from '@/shared/ui/Typography';
import AvatarByName from '@/shared/ui/AvatarByName';
import CreateGroup from '@/features/CreateGroup/ui/ui';
import Settings from '@/widgets/Settings/ui/ui';
import { useTheme } from '@/entities/theme/lib/hooks/useTheme';
import { useModal } from '@/shared/lib/hooks/useModal';
import { useProfile } from '@/shared/lib/hooks/useProfile';
import { Button } from '@/shared/ui/Button';
import { Archive, Moon, Users, Settings as SettingsIcon, Verified } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/shared/lib/utils/cn';
import { ModalConfig } from '@/shared/lib/contexts/modal/types';
import { SettingsProvider } from '@/widgets/Settings/lib/contexts/provider';
import { CreateGroupProvider } from '@/features/CreateGroup/model/provider';
import Image from '@/shared/ui/Image';

const listIconStyle = 'dark:text-primary-white text-primary-dark-200 w-5 h-5';

const LayoutSheet = ({ setSheetOpen }: { setSheetOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const { profile } = useProfile();
    const { openModal } = useModal();
    const { setTheme, theme } = useTheme();

    const onSheetAction = (modal: ModalConfig) => {
        setSheetOpen(false);
        openModal(modal);
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
            action: () =>
                onSheetAction({
                    withHeader: false,
                    content: (
                        <CreateGroupProvider>
                            <CreateGroup />
                        </CreateGroupProvider>
                    ),
                    bodyClassName: 'max-w-[450px] p-5 h-auto'
                })
        },
        {
            title: 'Settings',
            icon: <SettingsIcon className={listIconStyle} />,
            action: () =>
                onSheetAction({
                    content: (
                        <SettingsProvider>
                            <Settings />
                        </SettingsProvider>
                    ),
                    bodyClassName: 'max-w-[450px] p-0 h-auto',
                    withHeader: false
                })
        }
    ];

    return (
        <div className='flex flex-col py-8 h-full'>
            <div className='flex flex-col gap-2 items-start px-4'>
                <Image
                    src={profile.avatar?.url}
                    skeleton={<AvatarByName name={profile.name} size='lg' />}
                    className='object-cover size-[50px] rounded-full'
                />
                <Typography as='h2' size='lg' weight='medium' className={cn(profile.isOfficial && 'flex items-center')}>
                    {profile.name}
                    {profile.isOfficial && (
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