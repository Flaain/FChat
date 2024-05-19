import Typography from '@/shared/ui/Typography';
import { cn } from '@/shared/lib/utils/cn';
import { Verified } from 'lucide-react';
import { useConversationContext } from '@/pages/Conversation/lib/hooks/useConversationContext';

const ConversationHeader = () => {
    const { conversation, info: { conversationName, isGroup, isConversationVerified } } = useConversationContext();

    return (
        <div className='flex items-center self-start w-full px-5 py-3 box-border dark:bg-primary-dark-100 sticky top-0 z-[999]'>
            <div className='flex flex-col items-start'>
                <Typography
                    as='h2'
                    size='lg'
                    weight='medium'
                    variant='primary'
                    className={cn(isConversationVerified && 'flex items-center gap-2')}
                >
                    {conversationName}
                    {isConversationVerified && (
                        <Typography>
                            <Verified className='w-5 h-5' />
                        </Typography>
                    )}
                </Typography>
                <Typography as='p' variant='secondary'>
                    {isGroup ? `${conversation.conversation.participants.length} members` : 'last seen yesterday at 10:00'}
                </Typography>
            </div>
        </div>
    );
};

export default ConversationHeader;