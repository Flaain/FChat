import Privacy from '@/features/Privacy/ui/ui';
import SettingsMain from './SettingsMain';
import ActiveSessions from '@/features/ActiveSessions/ui/ui';
import ChangePassword from '@/features/ChangePassword/ui/ui';
import Typography from '@/shared/ui/Typography';
import { useSettings } from '../lib/hooks/useSettings';
import { ArrowLeft, X } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useModal } from '@/shared/lib/hooks/useModal';
import { SettingMenu } from '../model/types';
import { titles } from '../lib/contexts/provider';
import MyAccount from '@/features/MyAccount/ui/ui';

const Settings = ({ modalId }: { modalId: string }) => {
    const { closeModal, isAsyncActionLoading } = useModal();
    const { currentMenu, onBack } = useSettings();

    const components: Record<SettingMenu, React.ReactNode> = {
        main: <SettingsMain />,
        privacy: <Privacy />,
        sessions: <ActiveSessions />,
        changePassword: <ChangePassword />,
        myAccount: <MyAccount />

    };

    return (
        <div className='flex flex-col py-5'>
            <div className='flex items-center px-5 gap-5'>
                {currentMenu !== 'main' && (
                    <Button variant='text' size='icon' className='h-auto p-0' onClick={onBack} disabled={isAsyncActionLoading}>
                        <ArrowLeft className='w-6 h-6' />
                    </Button>
                )}
                <Typography as='h1' variant='primary' size='xl' weight='medium' className='self-start'>
                    {titles[currentMenu]}
                </Typography>
                <Button variant='text' size='icon' className='h-auto p-0 ml-auto' onClick={() => closeModal()} disabled={isAsyncActionLoading}>
                    <X className='w-6 h-6' />
                </Button>
            </div>
            {components[currentMenu as keyof typeof components]}
        </div>
    );
};

export default Settings;