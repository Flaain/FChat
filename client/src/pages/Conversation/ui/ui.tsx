import ConversationSkeleton from './Skeletons/ConversationSkeleton';
import MessagesList from '@/widgets/MessagesList/ui/ui';
import Typography from '@/shared/ui/Typography';
import SendMessage from '@/features/SendMessage/ui/ui';
import OutletContainer from '@/shared/ui/OutletContainer';
import OutletError from '@/shared/ui/OutletError';
import ConversationDDM from '@/features/ConversationDDM/ui/ui';
import OutletHeader from '@/widgets/OutletHeader/ui/ui';
import { useConversationContext } from '../lib/hooks/useConversationContext';
import { Button } from '@/shared/ui/Button';
import { Loader2 } from 'lucide-react';
import { ConversationStatuses } from '../model/types';
import { PRESENCE } from '@/shared/model/types';
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
        setShowRecipientDetails,
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

    return (
        components[status as keyof typeof components] ?? (
            <OutletContainer>
                <div className='w-full h-svh flex flex-col gap-5'>
                    <OutletHeader
                        name={data.conversation.recipient.name}
                        isOfficial={data.conversation.recipient.isOfficial}
                        description={
                            data.conversation.recipient.presence === PRESENCE.ONLINE
                                ? 'online'
                                : `last seen ${getRelativeTimeString(data.conversation.recipient.lastSeenAt, 'en-US')}`
                        }
                        dropdownMenu={<ConversationDDM />}
                        onClick={() => setShowRecipientDetails((prevState) => !prevState)}
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
                {showRecipientDetails && <div className='max-xl:absolute max-xl:top-0 max-xl:right-0 z-[999] px-5 py-3 dark:bg-primary-dark-50 h-full max-w-[390px] w-full border-l-2 border-primary-dark-50'>test details block</div>}
            </OutletContainer>
        )
    );
};

export default Conversation;