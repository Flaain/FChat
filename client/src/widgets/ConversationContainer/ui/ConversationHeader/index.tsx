import Typography from '@/shared/ui/Typography';
import { cn } from '@/shared/lib/utils/cn';
import { Loader2, Verified } from 'lucide-react';
import { useConversationContext } from '@/pages/Conversation/lib/hooks/useConversationContext';
import { useSocket } from '@/shared/lib/hooks/useSocket';

const ConversationHeader = () => {
    const { data } = useConversationContext();
    const { isConnected } = useSocket();

    return (
        <div className='flex items-center self-start w-full px-5 py-3 box-border dark:bg-primary-dark-100 sticky top-0 z-[999]'>
            <div className='flex flex-col items-start w-full gap-1'>
                <Typography
                    as='h2'
                    size='lg'
                    weight='medium'
                    variant='primary'
                    className={cn(data?.conversation?.recipient.isVerified && 'flex items-center gap-2')}
                >
                    {data?.conversation?.recipient.name}
                    {data?.conversation?.recipient.isVerified && (
                        <Typography>
                            <Verified className='w-5 h-5' />
                        </Typography>
                    )}
                </Typography>
                {isConnected ? (
                    <Typography as='p' variant='secondary'>
                        last seen yesterday at 10:00
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

export default ConversationHeader;