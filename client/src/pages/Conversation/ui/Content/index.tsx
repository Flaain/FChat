import OutletContainer from "@/shared/ui/OutletContainer";
import Typography from "@/shared/ui/Typography";
import MessagesList from "@/widgets/MessagesList/ui/ui";
import OutletHeader from "@/widgets/OutletHeader/ui/ui";
import OutletDetails from "@/widgets/OutletDetails/ui/ui";
import AvatarByName from "@/shared/ui/AvatarByName";
import RecipientDetails from "@/widgets/RecipientDetails/ui/ui";
import ConversationDDM from "@/features/ConversationDDM/ui/ui";
import SendMessage from "@/features/SendMessage/ui/ui";
import Image from "@/shared/ui/Image";
import { FeedTypes } from "@/shared/model/types";
import { useConversationContext } from "../../lib/hooks/useConversationContext";

const Content = () => {
    const {
        data,
        listRef,
        getPreviousMessages,
        isPreviousMessagesLoading,
        getConversationDescription,
        setShowAnchor,
        openDetails,
        showRecipientDetails,
        closeDetails,
        showAcnhor,
        handleAnchorClick,
        handleTypingStatus
    } = useConversationContext();

    return (
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
                        listRef={listRef}
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
                    avatarSlot={
                        <Image
                            src={data.conversation.recipient.avatar?.url}
                            skeleton={<AvatarByName name={data.conversation.recipient.name} size='5xl' />}
                            className='object-cover object-center size-28 rounded-full'
                        />
                    }
                    description={getConversationDescription(false)}
                    info={<RecipientDetails recipient={data.conversation.recipient} />}
                    type={FeedTypes.CONVERSATION}
                    onClose={closeDetails}
                />
            )}
        </OutletContainer>
    );
};

export default Content;
