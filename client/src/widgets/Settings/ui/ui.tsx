import Privacy from '@/features/Privacy/ui/ui';
import SettingsMain from './SettingsMain';
import Typography from '@/shared/ui/Typography';
import { useSettings } from '../lib/hooks/useSettings';
import { ArrowLeft, X } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useModal } from '@/shared/lib/hooks/useModal';
import { SettingMenu } from '../model/types';
import ActiveSessions from '@/features/ActiveSessions/ui/ui';

const Settings = () => {
    const { closeModal } = useModal();
    const { currentMenu, titles, onBack } = useSettings();

    const components: Record<SettingMenu, React.ReactNode> = {
        main: <SettingsMain />,
        privacy: <Privacy />,
        sessions: <ActiveSessions />
    };

    return (
        <div className='flex flex-col'>
            <div className='flex items-center p-5 gap-5'>
                {currentMenu !== 'main' && (
                    <Button variant='text' className='h-auto p-0' onClick={onBack}>
                        <ArrowLeft className='w-6 h-6' />
                    </Button>
                )}
                <Typography as='h1' variant='primary' size='xl' weight='medium' className='self-start'>
                    {titles[currentMenu]}
                </Typography>
                <Button variant='text' className='h-auto p-0 ml-auto' onClick={closeModal}>
                    <X className='w-6 h-6' />
                </Button>
            </div>
            {components[currentMenu as keyof typeof components]}
        </div>
    );
};

export default Settings;