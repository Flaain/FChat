import { AvatarByName } from '@/shared/ui/AvatarByName';
import { Typography } from '@/shared/ui/Typography';
import { EditName } from '@/features/EditName/ui/ui';
import { useMyAccount } from '../lib/useMyAccount';
import { AtSign, Camera, Loader2, Mail, UserCircle2 } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Image } from '@/shared/ui/Image';
import { useModal } from '@/shared/lib/providers/modal';
import { useProfile } from '@/entities/profile';
import { useSocket } from '@/shared/lib/hooks/useSocket';

export const MyAccount = () => {
    const { isConnected } = useSocket();
    const { statusValue, symbolsLeft, onChangeStatus } = useMyAccount();
    const { profile, isUploadingAvatar, handleUploadAvatar } = useProfile((state) => ({
        profile: state.profile,
        isUploadingAvatar: state.isUploadingAvatar,
        handleUploadAvatar: state.handleUploadAvatar
    }));

    const onOpenModal = useModal((state) => state.onOpenModal);

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
                        aria-disabled={isUploadingAvatar}
                        className='aria-[disabled="false"]:hover:dark:bg-slate-200 transition-colors duration-200 ease-in-out aria-[disabled="false"]:cursor-pointer size-8 flex items-center justify-center rounded-full border border-solid dark:bg-slate-100 bg-primary-dark-50 dark:border-primary-dark-50 border-primary-white absolute bottom-0 right-0'
                    >
                        {isUploadingAvatar ? (
                            <Loader2 className='w-5 h-6 animate-spin' />
                        ) : (
                            <Camera className='w-5 h-5' />
                        )}
                        <Input
                            disabled={isUploadingAvatar}
                            type='file'
                            className='sr-only'
                            onChange={handleUploadAvatar}
                        />
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
                        onChange={onChangeStatus}
                        placeholder='status'
                        className='overscroll-contain pt-3 disabled:opacity-50 leading-5 min-h-[24px] scrollbar-hide max-h-[120px] overflow-auto flex pr-2 box-border w-full transition-colors duration-200 ease-in-out resize-none appearance-none ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none focus:placeholder:opacity-0 focus:placeholder:translate-x-2 outline-none ring-0 placeholder:transition-all placeholder:duration-300 placeholder:ease-in-out dark:bg-primary-dark-100 border-none text-white dark:placeholder:text-white placeholder:opacity-50'
                    ></textarea>
                    <Typography as='p' variant={symbolsLeft < 0 ? 'error' : 'secondary'} size='sm'>
                        {symbolsLeft}
                    </Typography>
                </form>
            </div>
            <ul className='flex flex-col mt-3'>
                <li>
                    <Button
                        onClick={() =>
                            onOpenModal({
                                content: <EditName />,
                                title: 'Edit your name',
                                bodyClassName: 'max-w-[400px] w-full h-auto p-5',
                                withHeader: false
                            })
                        }
                        variant='ghost'
                        className='px-5 flex items-center gap-4 justify-start w-full rounded-none'
                    >
                        <UserCircle2 className='w-5 h-5' />
                        <Typography as='h3'>Name</Typography>
                        <Typography variant='secondary' className='ml-auto'>
                            {profile.name}
                        </Typography>
                    </Button>
                </li>
                <li>
                    <Button variant='ghost' className='px-5 flex items-center gap-4 justify-start w-full rounded-none'>
                        <Mail className='w-5 h-5' />
                        <Typography as='h3'>Email</Typography>
                        <Typography variant='secondary' className='ml-auto'>
                            {profile.email}
                        </Typography>
                    </Button>
                </li>
                <li>
                    <Button variant='ghost' className='px-5 flex items-center gap-4 justify-start w-full rounded-none'>
                        <AtSign className='w-5 h-5' />
                        <Typography as='h3'>Login</Typography>
                        <Typography variant='secondary' className='ml-auto'>
                            {profile.login}
                        </Typography>
                    </Button>
                </li>
            </ul>
        </div>
    );
};