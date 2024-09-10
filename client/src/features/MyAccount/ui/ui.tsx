import AvatarByName from '@/shared/ui/AvatarByName';
import Typography from '@/shared/ui/Typography';
import EditName from '@/features/EditName/ui/ui';
import { useLayoutContext } from '@/shared/lib/hooks/useLayoutContext';
import { useProfile } from '@/shared/lib/hooks/useProfile';
import { useMyAccount } from '../lib/hooks/useMyAccount';
import { AtSign, Camera, Loader2, Mail, UserCircle2 } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useModal } from '@/shared/lib/hooks/useModal';
import { Input } from '@/shared/ui/Input';
import Image from '@/shared/ui/Image';

const MyAccount = () => {
    const { openModal } = useModal();
    const { profile } = useProfile();
    const { isConnected } = useLayoutContext();
    const { statusValue, symbolsLeft, isUploading, handleChangeStatus, handleChangeAvatar } = useMyAccount();

    const list: Array<{ icon: React.ReactNode; title: string; value: string; action: () => void }> = [
        {
            title: 'Name',
            value: profile.name,
            icon: <UserCircle2 className='w-5 h-5' />,
            action: () =>
                openModal({
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
                <div className='relative'>
                    <Image
                        src={profile.avatar?.url}
                        skeleton={<AvatarByName name={profile.name} size='4xl' />}
                        className='object-cover size-24 rounded-full'
                    />
                    <label
                        aria-disabled={isUploading}
                        className='aria-[disabled="false"]:hover:dark:bg-slate-200 transition-colors duration-200 ease-in-out aria-[disabled="false"]:cursor-pointer size-8 flex items-center justify-center rounded-full border border-solid dark:bg-slate-100 bg-primary-dark-50 dark:border-primary-dark-50 border-primary-white absolute bottom-0 right-0'
                    >
                        {isUploading ? <Loader2 className='w-5 h-6 animate-spin' /> : <Camera className='w-5 h-5' />}
                        <Input disabled={isUploading} type='file' className='sr-only' onChange={handleChangeAvatar} />
                    </label>
                </div>
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
            <ul className='flex flex-col mt-3'>
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