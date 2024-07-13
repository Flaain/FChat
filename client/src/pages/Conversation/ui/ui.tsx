import ConversationSkeleton from './Skeletons/ConversationSkeleton';
import MessagesList from '@/widgets/MessagesList/ui/ui';
import Typography from '@/shared/ui/Typography';
import SendMessage from '@/features/SendMessage/ui/ui';
import ChatHeader from '@/shared/ui/ChatHeader';
import OutletContainer from '@/shared/ui/OutletContainer';
import OutletError from '@/shared/ui/OutletError';
import { useConversationContext } from '../lib/hooks/useConversationContext';
import { Button } from '@/shared/ui/Button';
import { Loader2 } from 'lucide-react';
import { ConversationStatuses } from '../model/types';
import { getRelativeTimeString } from '@/shared/lib/utils/getRelativeTimeString';

const Conversation = () => {
    const { data, refetch, error, status, isRefetching } = useConversationContext();

    const components: Record<Exclude<ConversationStatuses, 'idle'>, React.ReactNode> = {
        error: (
            <OutletError
                title='Something went wrong'
                description={error!}
                callToAction={
                    <Button onClick={refetch} className='mt-5'>
                        {isRefetching ? <Loader2 className='w-6 h-6 animate-spin' /> : 'try again'}
                    </Button>
                }
            />
        ),
        loading: <ConversationSkeleton />
    };

    return (
        components[status as keyof typeof components] ?? (
            <OutletContainer>
                <ChatHeader
                    name={data.conversation.recipient.name}
                    isVerified={data.conversation.recipient.isVerified}
                    description={`last seen at ${getRelativeTimeString(new Date(data.conversation.recipient.lastSeenAt), 'en-US')}`}
                />
                {data.conversation.messages.length ? (
                    <MessagesList />
                ) : (
                    <Typography
                        variant='primary'
                        className='my-auto px-5 py-2 rounded-full dark:bg-primary-dark-50 bg-primary-white'
                    >
                        No messages yet
                    </Typography>
                )}
                <SendMessage type='conversation' queryId={data.conversation.recipient._id} />
            </OutletContainer>
        )
    );
};

export default Conversation;