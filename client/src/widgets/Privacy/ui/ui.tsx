import { Button } from '@/shared/ui/Button';
import { useSettings } from '@/widgets/Settings/model/context';
import { LockKeyhole, MonitorSmartphone } from 'lucide-react';

const Privacy = () => {
    const onMenuChange = useSettings((state) => state.onMenuChange);
    
    return (
        <ul className='flex flex-col pt-5'>
            <li>
                <Button
                    onClick={() => onMenuChange('sessions')}
                    variant='ghost'
                    className='px-5 flex items-center gap-4 justify-start w-full rounded-none'
                >
                    <MonitorSmartphone className='w-5 h-5' />
                    Active sessions
                </Button>
            </li>
            <li>
                <Button
                    onClick={() => onMenuChange('changePassword')}
                    variant='ghost'
                    className='px-5 flex items-center gap-4 justify-start w-full rounded-none'
                >
                    <LockKeyhole className='w-5 h-5' />
                    Change password
                </Button>
            </li>
        </ul>
    );
};

export default Privacy;