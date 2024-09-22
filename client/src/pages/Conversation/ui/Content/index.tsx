import { MessagesList } from '@/widgets/MessagesList';
import { OutletHeader } from '@/widgets/OutletHeader';
import { OutletDetails } from '@/widgets/OutletDetails';
import { AvatarByName } from '@/shared/ui/AvatarByName';
import { SendMessage } from '@/features/SendMessage/ui/ui';
import { Image } from '@/shared/ui/Image';
import { FeedTypes } from '@/shared/model/types';
import { useConversation } from '../../model/context';
import { getConversationDescription } from '../../lib/getConversationDescription';
import { OutletContainer } from '@/shared/ui/OutletContainer';
import { Typography } from '@/shared/ui/Typography';
import { RecipientDetails } from '../RecipientDetails';
import { ConversationDDM } from '../DropdownMenu';
import { getScrollBottom } from '@/shared/lib/utils/getScrollBottom';

export const Content = () => {
    const {
        data,
        isRecipientTyping,
        getPreviousMessages,
        isPreviousMessagesLoading,
        showRecipientDetails,
        handleTypingStatus,
        onDetails,
        lastMessageRef,
        listRef
    } = useConversation();
    
    return (
        <OutletContainer>
            <div className='w-full h-svh flex flex-col gap-5'>
                <OutletHeader
                    name={data.conversation.recipient.name}
                    isOfficial={data.conversation.recipient.isOfficial}
                    description={getConversationDescription({ data, isRecipientTyping })}
                    dropdownMenu={<ConversationDDM />}
                    onClick={() => onDetails(true)}
                />
                {data.conversation.messages.length ? (
                    <MessagesList
                        listRef={listRef}
                        lastMessageRef={lastMessageRef}
                        messages={data.conversation.messages}
                        getPreviousMessages={getPreviousMessages}
                        isFetchingPreviousMessages={isPreviousMessagesLoading}
                        nextCursor={data.nextCursor}
                        canFetch={!isPreviousMessagesLoading && !!data.nextCursor}
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
                        onAnchorClick={() => listRef.current?.scrollTo({ top: getScrollBottom(listRef.current!), left: 0, behavior: 'smooth' })}
                        onChange={handleTypingStatus}
                        queryId={data.conversation.recipient._id}
                    />
                )}
            </div>
            {showRecipientDetails && (
                <OutletDetails
                    name={data.conversation.recipient.name}
                    avatarSlot={
                        <Image
                            src={data.conversation.recipient.avatar?.url}
                            skeleton={<AvatarByName name={data.conversation.recipient.name} size='5xl' />}
                            className='object-cover object-center size-28 rounded-full'
                        />
                    }
                    description={getConversationDescription({
                        data,
                        isRecipientTyping,
                        shouldDisplayTypingStatus: false
                    })}
                    info={<RecipientDetails recipient={data.conversation.recipient} />}
                    type={FeedTypes.CONVERSATION}
                    onClose={() => onDetails(false)}
                />
            )}
        </OutletContainer>
    );
};