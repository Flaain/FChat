import React from 'react';
import Privacy from '@/widgets/Privacy/ui/ui';
import { SettingsMain } from './SettingsMain';
import { MyAccount } from '@/features/MyAccount/ui/ui';
import { ChangePassword } from '@/features/ChangePassword/ui/ui';
import { Typography } from '@/shared/ui/Typography';
import { ArrowLeft, X } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { SettingMenu } from '../model/types';
import { titles } from '../model/constants';
import { useModal } from '@/shared/lib/providers/modal';
import { useSettings } from '../model/context';
import { ActiveSessions } from '@/widgets/ActiveSessions';

const components: Record<Exclude<SettingMenu, 'deleteAccount'>, React.ReactNode> = {
    main: <SettingsMain />,
    privacy: <Privacy />,
    sessions: <ActiveSessions />,
    changePassword: <ChangePassword />,
    myAccount: <MyAccount />
};

export const Settings = () => {
    const { onCloseModal, isModalDisabled } = useModal();
    const { menu, onBack } = useSettings();

    return (
        <div className='flex flex-col py-5'>
            <div className='flex items-center px-5 gap-5'>
                {menu !== 'main' && (
                    <Button variant='text' size='icon' className='h-auto p-0' onClick={onBack} disabled={isModalDisabled}>
                        <ArrowLeft className='w-6 h-6' />
                    </Button>
                )}
                <Typography as='h1' variant='primary' size='xl' weight='medium' className='self-start'>
                    {titles[menu]}
                </Typography>
                <Button variant='text' size='icon' className='h-auto p-0 ml-auto' onClick={onCloseModal} disabled={isModalDisabled}>
                    <X className='w-6 h-6' />
                </Button>
            </div>
            {components[menu as keyof typeof components]}
        </div>
    );
};