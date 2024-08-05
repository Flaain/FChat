import AvatarByName from '@/shared/ui/AvatarByName';
import Typography from '@/shared/ui/Typography';
import EditName from '@/features/EditName/ui/ui';
import { useLayoutContext } from '@/shared/lib/hooks/useLayoutContext';
import { useProfile } from '@/shared/lib/hooks/useProfile';
import { useMyAccount } from '../lib/hooks/useMyAccount';
import { AtSign, Mail, UserCircle2 } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useModal } from '@/shared/lib/hooks/useModal';

const MyAccount = () => {
    const { openModal } = useModal();
    const { profile } = useProfile();
    const { isConnected } = useLayoutContext();
    const { statusValue, symbolsLeft, handleChangeStatus } = useMyAccount();

    const list: Array<{ icon: React.ReactNode; title: string; value: string; action: () => void }> = [
        {
            title: 'Name',
            value: profile.name,
            icon: <UserCircle2 className='w-5 h-5' />,
            action: () => openModal({ 
                id: 'editName',
                content: <EditName />,
                title: 'Edit your name',
                bodyClassName: 'max-w-[400px] w-full h-auto p-5',
                withHeader: false
             })
        },
        {
            title: 'Email',
            value: profile.email,
            icon: <Mail className='w-5 h-5' />,
            action: () => {}
        },
        {
            title: 'Login',
            value: `@${profile.login}`,
            icon: <AtSign className='w-5 h-5' />,
            action: () => {}
        }
    ];

    return (
        <div className='flex flex-col'>
            <div className='flex flex-col items-center justify-center pt-5 px-5'>
                <AvatarByName name={profile.name} size='4xl' />
                <Typography as='h2' variant='primary' size='xl' weight='medium' className='mt-2'>
                    {profile.name}
                </Typography>
                <Typography as='p' variant={isConnected ? 'primary' : 'secondary'} size='sm'>
                    {isConnected ? 'online' : 'offline'}
                </Typography>
                <form className='flex items-center w-full'>
                    <textarea
                        rows={0}
                        value={statusValue}
                        onChange={handleChangeStatus}
                        placeholder='status'
                        className='overscroll-contain pt-3 disabled:opacity-50 leading-5 min-h-[24px] scrollbar-hide max-h-[120px] overflow-auto flex pr-2 box-border w-full transition-colors duration-200 ease-in-out resize-none appearance-none ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none focus:placeholder:opacity-0 focus:placeholder:translate-x-2 outline-none ring-0 placeholder:transition-all placeholder:duration-300 placeholder:ease-in-out dark:bg-primary-dark-100 border-none text-white dark:placeholder:text-white placeholder:opacity-50'
                    ></textarea>
                    <Typography as='p' variant={symbolsLeft < 0 ? 'error' : 'secondary'} size='sm'>
                        {symbolsLeft}
                    </Typography>
                </form>
            </div>
            <ul className='flex flex-col mt-2'>
                {list.map(({ title, value, icon, action }, index) => (
                    <li key={index}>
                        <Button
                            onClick={action}
                            variant='ghost'
                            className='px-5 flex items-center gap-4 justify-start w-full rounded-none'
                        >
                            {icon}
                            <Typography as='h3'>{title}</Typography>
                            <Typography variant='secondary' className='ml-auto'>
                                {value}
                            </Typography>
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MyAccount;