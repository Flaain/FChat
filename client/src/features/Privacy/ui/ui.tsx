import { Button } from '@/shared/ui/Button';
import { useSettings } from '@/widgets/Settings/lib/hooks/useSettings';
import { LockKeyhole, MonitorSmartphone } from 'lucide-react';

const Privacy = () => {
    const { onMenuChange } = useSettings();

    const list: Array<{ icon: React.ReactNode; title: string; action: () => void }> = [
        {
            title: 'Active sessions',
            icon: <MonitorSmartphone className='w-5 h-5' />,
            action: () => onMenuChange('sessions')
        },
        {
            title: 'Change password',
            icon: <LockKeyhole className='w-5 h-5' />,
            action: () => onMenuChange('changePassword')
        }
    ];

    return (
        <ul className='flex flex-col pt-5'>
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
    );
};

export default Privacy;