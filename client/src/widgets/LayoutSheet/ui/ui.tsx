import { Switch } from '@/shared/ui/Switch';
import { Typography } from '@/shared/ui/Typography';
import { AvatarByName } from '@/shared/ui/AvatarByName';
import { Image } from '@/shared/ui/Image';
import { Button } from '@/shared/ui/Button';
import { Archive, Moon, Users, Settings as SettingsIcon, Verified } from 'lucide-react';
import { cn } from '@/shared/lib/utils/cn';
import { useProfile } from '@/entities/profile/model/context';
import { ModalConfig, useModal } from '@/shared/lib/providers/modal';
import { CreateGroup, CreateGroupProvider } from '@/features/CreateGroup';
import { useTheme } from '@/entities/theme';
import { useLayout } from '@/shared/lib/providers/layout/context';
import { SettingsProvider, Settings } from '@/widgets/Settings';

const listIconStyle = 'dark:text-primary-white text-primary-dark-200 w-5 h-5';

export const LayoutSheet = () => {
    const { setTheme, theme } = useTheme();
    const { onSheet } = useLayout();
    const { profile } = useProfile();
    const { onOpenModal } = useModal();

    const onSheetAction = (modal: ModalConfig) => {
        onSheet(false);
        onOpenModal(modal);
    };

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
                <li className='first:my-4 first:py-1 first:border-y dark:first:border-primary-dark-50 first:border-primary-dark-200'>
                    <Button variant='ghost' className='rounded-none flex items-center justify-start gap-4 w-full'>
                        <Archive className={listIconStyle} />
                        <Typography weight='medium'>Archived chats</Typography>
                    </Button>
                </li>
                <li className='first:my-4 first:py-1 first:border-y dark:first:border-primary-dark-50 first:border-primary-dark-200'>
                    <Button
                        variant='ghost'
                        className='rounded-none flex items-center justify-start gap-4 w-full'
                        onClick={() =>
                            onSheetAction({
                                withHeader: false,
                                content: (
                                    <CreateGroupProvider>
                                        <CreateGroup />
                                    </CreateGroupProvider>
                                ),
                                bodyClassName: 'max-w-[450px] p-5 h-auto'
                            })
                        }
                    >
                        <Users className={listIconStyle} />
                        <Typography weight='medium'>New Group</Typography>
                    </Button>
                </li>
                <li className='first:my-4 first:py-1 first:border-y dark:first:border-primary-dark-50 first:border-primary-dark-200'>
                    <Button
                        variant='ghost'
                        className='rounded-none flex items-center justify-start gap-4 w-full'
                        onClick={() =>
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
                    >
                        <SettingsIcon className={listIconStyle} />
                        <Typography weight='medium'>Settings</Typography>
                    </Button>
                </li>
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