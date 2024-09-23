import React from 'react';
import ChromeLogo from '@/shared/lib/assets/icons/chrome.svg?react';
import FireFoxLogo from '@/shared/lib/assets/icons/firefox.svg?react';
import SafariLogo from '@/shared/lib/assets/icons/safari.svg?react';
import EdgeLogo from '@/shared/lib/assets/icons/edge.svg?react';
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';
import { Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { SessionProps } from '../model/types';
import { sessionAPI } from '../api';
import { useModal } from '@/shared/lib/providers/modal';

const iconStyles = 'w-7 h-7 dark:fill-primary-white fill-primary-dark-50';

const iconsMap = {
    Chrome: <ChromeLogo className={iconStyles} />,
    Firefox: <FireFoxLogo className={iconStyles} />,
    Safari: <SafariLogo className={iconStyles} />,
    Edge: <EdgeLogo className={iconStyles} />
};

export const Session = ({ session, withDropButton, dropButtonDisabled, onDrop }: SessionProps) => {
    const { onAsyncActionModal } = useModal();

    const [isDroping, setIsDroping] = React.useState(false);

    const browser = session.userAgent?.browser;
    const OS = session.userAgent?.os;

    const handleDrop = async () => {
        setIsDroping(true);
        
        await onAsyncActionModal(() => sessionAPI.dropSession(session._id), {
            onResolve: () => {
                onDrop?.(session);
                toast.success('Session dropped', { position: 'top-center' });
            },
            onReject: () => toast.error('Failed to drop session'),
        })
        
        setIsDroping(false);
    };

    return (
        <div className='flex items-start gap-5'>
            <div className='p-2 rounded-full flex items-center justify-center dark:bg-primary-dark-50 bg-primary-white'>
                {iconsMap[browser.name as keyof typeof iconsMap] ?? (
                    <Typography
                        as='span'
                        weight='semibold'
                        size='2xl'
                        className='flex items-center justify-center w-7 h-7'
                    >
                        ?
                    </Typography>
                )}
            </div>
            <div className='flex flex-col'>
                <Typography as='h3' variant='primary'>
                    {browser?.name ?? 'Unknown'}&nbsp;{browser?.major}
                </Typography>
                <Typography as='h3' variant='primary' size='sm'>
                    {OS?.name ?? 'Unknown'}&nbsp;{OS?.version}
                </Typography>
                <Typography as='p' variant='secondary' className='line-clamp-1' size='sm'>
                    Session created at&nbsp;-&nbsp;
                    {new Date(session.createdAt).toLocaleDateString()}
                </Typography>
            </div>
            {withDropButton && (
                <Button
                    variant='text'
                    className='p-0 w-6 h-6 ml-auto overflow-hidden'
                    title='drop session'
                    disabled={isDroping || dropButtonDisabled}
                    onClick={handleDrop}
                >
                    {isDroping ? <Loader2 className='w-5 h-5 animate-spin' /> : <X className='w-5 h-5' />}
                </Button>
            )}
        </div>
    );
};