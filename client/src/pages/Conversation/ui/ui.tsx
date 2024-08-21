import ConversationSkeleton from './Skeletons/ConversationSkeleton';
import MessagesList from '@/widgets/MessagesList/ui/ui';
import Typography from '@/shared/ui/Typography';
import SendMessage from '@/features/SendMessage/ui/ui';
import OutletContainer from '@/shared/ui/OutletContainer';
import OutletError from '@/shared/ui/OutletError';
import ConversationDDM from '@/features/ConversationDDM/ui/ui';
import OutletHeader from '@/widgets/OutletHeader/ui/ui';
import OutletDetails from '@/widgets/OutletDetails/ui/ui';
import RecipientDetails from '@/widgets/RecipientDetails/ui/ui';
import { useConversationContext } from '../lib/hooks/useConversationContext';
import { Button } from '@/shared/ui/Button';
import { Loader2 } from 'lucide-react';
import { ConversationStatuses } from '../model/types';
import { FeedTypes, PRESENCE } from '@/shared/model/types';
import { getRelativeTimeString } from '@/shared/lib/utils/getRelativeTimeString';

const Conversation = () => {
    const {
        data,
        refetch,
        error,
        status,
        isRefetching,
        getPreviousMessages,
        isPreviousMessagesLoading,
        closeDetails,
        openDetails,
        showRecipientDetails
    } = useConversationContext();

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

    const isOnline = data?.conversation.recipient.presence === PRESENCE.ONLINE;

    return (
        components[status as keyof typeof components] ?? (
            <OutletContainer>
                <div className='w-full h-svh flex flex-col gap-5'>
                    <OutletHeader
                        name={data.conversation.recipient.name}
                        isOfficial={data.conversation.recipient.isOfficial}
                        description={isOnline ? 'online' : `last seen ${getRelativeTimeString(data.conversation.recipient.lastSeenAt, 'en-US')}`}
                        dropdownMenu={<ConversationDDM />}
                        onClick={openDetails}
                    />
                    {data.conversation.messages.length ? (
                        <MessagesList
                            type='conversation'
                            messages={data.conversation.messages}
                            getPreviousMessages={getPreviousMessages}
                            isFetchingPreviousMessages={isPreviousMessagesLoading}
                            nextCursor={data.nextCursor}
                            canFetch={!isPreviousMessagesLoading && !!data.nextCursor}
                        />
                    ) : (
                        <Typography
                            variant='primary'
                            className='my-auto px-5 py-2 rounded-full dark:bg-primary-dark-50 bg-primary-white'
                        >
                            No messages yet
                        </Typography>
                    )}
                    <SendMessage type='conversation' queryId={data.conversation.recipient._id} />
                </div>
                {showRecipientDetails && (
                    <OutletDetails
                        name={data.conversation.recipient.name}
                        description={isOnline ? 'online' : `last seen at ${new Date(data.conversation.recipient.lastSeenAt).toLocaleTimeString(navigator.language, { 
                            hour: 'numeric', 
                            minute: 'numeric' 
                        })}`}
                        info={<RecipientDetails recipient={data.conversation.recipient} />}
                        shouldCloseOnClickOutside={false}
                        type={FeedTypes.CONVERSATION}
                        onClose={closeDetails}
                    />
                )}
            </OutletContainer>
        )
    );
};

export default Conversation;