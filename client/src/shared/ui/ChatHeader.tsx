import Typography from '@/shared/ui/Typography';
import { cn } from '@/shared/lib/utils/cn';
import { Loader2, Verified } from 'lucide-react';
import { useSocket } from '@/shared/lib/hooks/useSocket';
import { ChatHeaderProps, FeedTypes } from '../model/types';
import { getRelativeTimeString } from '../lib/utils/getRelativeTimeString';

const ChatHeader = (props: ChatHeaderProps) => {
    const { isConnected } = useSocket();

    return (
        <div className='flex items-center self-start w-full px-5 py-3 box-border dark:bg-primary-dark-100 sticky top-0 z-[999]'>
            <div className='flex flex-col items-start w-full gap-1'>
                <Typography
                    as='h2'
                    size='lg'
                    weight='medium'
                    variant='primary'
                    className={cn(props.isVerified && 'flex items-center gap-2')}
                >
                    {props.name}
                    {props.isVerified && (
                        <Typography>
                            <Verified className='w-5 h-5' />
                        </Typography>
                    )}
                </Typography>
                {isConnected ? (
                    <Typography as='p' variant='secondary'>
                        {props.type === FeedTypes.CONVERSATION
                            ? `last seen ${getRelativeTimeString(new Date(props.lastSeenAt), 'en-US')}`
                            : `${props.members} members`}
                    </Typography>
                ) : (
                    <Typography size='sm' className='flex items-center gap-2'>
                        <Loader2 className='w-5 h-5 animate-spin' />
                        Connecting...
                    </Typography>
                )}
            </div>
        </div>
    );
};

export default ChatHeader;