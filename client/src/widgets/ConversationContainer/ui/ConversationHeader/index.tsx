import Typography from '@/shared/ui/Typography';
import { cn } from '@/shared/lib/utils/cn';
import { Verified } from 'lucide-react';
import { useConversationContext } from '@/pages/Conversation/lib/hooks/useConversationContext';

const ConversationHeader = () => {
    const { info: { filteredParticipants } } = useConversationContext();

    return (
        <div className='flex items-center self-start w-full px-5 py-3 box-border dark:bg-primary-dark-100 sticky top-0 z-[999]'>
            <div className='flex flex-col items-start'>
                <Typography
                    as='h2'
                    size='lg'
                    weight='medium'
                    variant='primary'
                    className={cn(filteredParticipants[0]?.isVerified && 'flex items-center gap-2')}
                >
                    {filteredParticipants[0]?.name}
                    {filteredParticipants[0]?.isVerified && (
                        <Typography>
                            <Verified className='w-5 h-5' />
                        </Typography>
                    )}
                </Typography>
                <Typography as='p' variant='secondary'>
                    last seen yesterday at 10:00
                </Typography>
            </div>
        </div>
    );
};

export default ConversationHeader;
