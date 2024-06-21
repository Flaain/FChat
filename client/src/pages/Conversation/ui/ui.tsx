import ConversationSkeleton from './Skeletons/ConversationSkeleton';
import MessagesList from '@/widgets/MessagesList/ui/ui';
import Typography from '@/shared/ui/Typography';
import SendMessage from '@/features/SendMessage/ui/ui';
import ConversationHeader from '../ui/ConversationHeader';
import { useConversationContext } from '../lib/hooks/useConversationContext';
import { Button } from '@/shared/ui/Button';
import { Loader2 } from 'lucide-react';
import { usePreviousMessages } from '../lib/hooks/usePreviousMessages';

const Conversation = () => {
    const { isLoading, data } = useConversationContext();
    const { conversationContainerRef, isLoading: previousMessagesLoading, getPreviousMessages } = usePreviousMessages();

    return isLoading ? (
        <ConversationSkeleton />
    ) : (
        <div
            ref={conversationContainerRef}
            className='flex flex-col flex-1 h-svh overflow-auto gap-5 items-center justify-start dark:bg-primary-dark-200 bg-primary-white'
        >
            <ConversationHeader />
            {data?.conversation.messages.length ? (
                <>
                    {data.nextCursor && (
                        <Button
                            variant='text'
                            className='p-0 dark:text-primary-white/30 text-primary-white'
                            onClick={getPreviousMessages}
                        >
                            {previousMessagesLoading ? (
                                <Loader2 className='w-6 h-6 animate-spin' />
                            ) : (
                                'Load previous messages'
                            )}
                        </Button>
                    )}
                    <MessagesList />
                </>
            ) : (
                <Typography
                    variant='primary'
                    className='my-auto px-5 py-2 rounded-full dark:bg-primary-dark-50 bg-primary-white'
                >
                    No messages yet
                </Typography>
            )}
            <SendMessage type='conversation' queryId={data?.conversation.recipient._id} />
        </div>
    );
};

export default Conversation;