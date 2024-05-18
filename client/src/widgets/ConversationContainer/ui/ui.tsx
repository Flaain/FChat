import SendMessage from '@/features/SendMessage/ui/ui';
import Typography from '@/shared/ui/Typography';
import MessagesList from '@/widgets/MessagesList/ui/ui';
import { ConversationContainerProvider } from '../model/provider';
import { useConversationContext } from '@/pages/Conversation/lib/hooks/useConversationContext';
import { useScrollContainer } from '../lib/hooks/useScrollContainer';
import { Button } from '@/shared/ui/Button';
import { Loader2 } from 'lucide-react';

const ConversationContainer = () => {
    const { conversation, info } = useConversationContext();
    const { conversationContainerRef, isLoading, getPreviousMessages } = useScrollContainer();

    return (
        <ConversationContainerProvider>
            <div
                ref={conversationContainerRef}
                className='flex flex-col flex-1 h-svh overflow-auto gap-5 items-center justify-start dark:bg-primary-dark-200 bg-primary-white'
            >
                <div className='flex items-center self-start w-full px-5 py-3 box-border dark:bg-primary-dark-100 sticky top-0 z-[999]'>
                    <div className='flex flex-col items-start'>
                        <Typography as='h2' size='lg' weight='medium' variant='primary'>
                            {info.conversationName}
                        </Typography>
                        <Typography as='p' variant='secondary'>
                            last seen yesterday at 10:00
                        </Typography>
                    </div>
                </div>
                {conversation?.conversation.messages.length ? (
                    <>
                        {conversation.nextCursor && (
                            <Button variant='text' className='p-0 dark:text-primary-white/30 text-primary-white' onClick={getPreviousMessages}>
                                {isLoading ? <Loader2 className='w-6 h-6 animate-spin' /> : 'Load previous messages'}
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
                <SendMessage />
            </div>
        </ConversationContainerProvider>
    );
};

export default ConversationContainer;