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
import { FeedTypes } from '@/shared/model/types';

const Conversation = () => {
    const {
        data,
        refetch,
        error,
        status,
        listRef,
        isRefetching,
        getPreviousMessages,
        getConversationDescription,
        handleTypingStatus,
        handleAnchorClick,
        setShowAnchor,
        showAcnhor,
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

    return (
        components[status as keyof typeof components] ?? (
            <OutletContainer>
                <div className='w-full h-svh flex flex-col gap-5'>
                    <OutletHeader
                        name={data.conversation.recipient.name}
                        isOfficial={data.conversation.recipient.isOfficial}
                        description={getConversationDescription()}
                        dropdownMenu={<ConversationDDM />}
                        onClick={openDetails}
                    />
                    {data.conversation.messages.length ? (
                        <MessagesList
                            listRef={listRef} // passing as mutable ref cuz we need to mutate in scroll listener
                            type={FeedTypes.CONVERSATION}
                            messages={data.conversation.messages}
                            getPreviousMessages={getPreviousMessages}
                            isFetchingPreviousMessages={isPreviousMessagesLoading}
                            nextCursor={data.nextCursor}
                            canFetch={!isPreviousMessagesLoading && !!data.nextCursor}
                            setShowAnchor={setShowAnchor}
                        />
                    ) : (
                        <Typography
                            variant='primary'
                            className='m-auto px-5 py-2 rounded-full dark:bg-primary-dark-50 bg-primary-white'
                        >
                            No messages yet
                        </Typography>
                    )}
                    {data.conversation.isInitiatorBlocked || data.conversation.isRecipientBlocked ? (
                        <div className='min-h-[70px] px-5 scrollbar-hide overflow-auto flex box-border w-full transition-colors duration-200 ease-in-out resize-none appearance-none ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none focus:placeholder:opacity-0 focus:placeholder:translate-x-2 outline-none ring-0 placeholder:transition-all placeholder:duration-300 placeholder:ease-in-out dark:bg-primary-dark-100 border-none text-white dark:placeholder:text-white placeholder:opacity-50'>
                            <Typography variant='secondary' className='m-auto text-center'>
                                {data.conversation.isRecipientBlocked
                                    ? `You blocked ${data.conversation.recipient.name}`
                                    : `${data.conversation.recipient.name} has restricted incoming messages`}
                            </Typography>
                        </div>
                    ) : (
                        <SendMessage
                            type='conversation'
                            showAnchor={showAcnhor}
                            onAnchorClick={handleAnchorClick}
                            onChange={handleTypingStatus}
                            queryId={data.conversation.recipient._id}
                        />
                    )}
                </div>
                {showRecipientDetails && (
                    <OutletDetails
                        name={data.conversation.recipient.name}
                        description={getConversationDescription(false)}
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