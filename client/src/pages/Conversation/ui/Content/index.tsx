import { MessagesList } from '@/widgets/MessagesList';
import { OutletHeader, OutletHeaderContainer } from '@/widgets/OutletHeader';
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
import { MessagesListProvider } from '@/widgets/MessagesList/model/provider';
import { messageAPI, useSelectMessage } from '@/entities/Message';
import { Trash, X } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useModal } from '@/shared/lib/providers/modal';
import { Confirm } from '@/shared/ui/Confirm';
import { toast } from 'sonner';
import { selectModalActions } from '@/shared/lib/providers/modal/store';

export const Content = () => {
    const { onOpenModal, onCloseModal, onAsyncActionModal } = useModal(selectModalActions);
    const {
        data: {
            conversation: { recipient, messages, isInitiatorBlocked, isRecipientBlocked },
            nextCursor
        },
        isRecipientTyping,
        getPreviousMessages,
        isPreviousMessagesLoading,
        showRecipientDetails,
        showAnchor,
        handleTypingStatus,
        onDetails,
        lastMessageRef,
        listRef
    } = useConversation();
    const params = { apiUrl: '/message', id: recipient._id, query: { recipientId: recipient._id } };
    const select = useSelectMessage();

    const scrollToBottom = () => listRef.current?.scrollTo({ top: getScrollBottom(listRef.current!), left: 0, behavior: 'smooth' });

    return (
        <OutletContainer>
            <div className='w-full h-svh flex flex-col gap-5'>
                {select.isSelecting ? (
                    <OutletHeaderContainer className='cursor-auto'>
                        <div className='flex items-center w-full'>
                            <Button variant='text' size='icon' className='mr-2' onClick={select.handleCancelSelecting}>
                                <X className='w-6 h-6' />
                            </Button>
                            <Typography>{`${select.selectedMessages.size} ${select.selectedMessages.size > 1 ? 'messages' : 'message'}`}</Typography>
                            <Button
                                onClick={() =>
                                    onOpenModal({
                                        content: (
                                            <Confirm
                                                text={`Do you want to delete ${select.selectedMessages.size > 1 ? `${select.selectedMessages.size} messages` : 'this message'}?`}
                                                onCancel={onCloseModal}
                                                onConfirmButtonVariant='destructive'
                                                onConfirmText='Delete'
                                                onConfirm={() =>
                                                    onAsyncActionModal(
                                                        () =>
                                                            messageAPI.delete({
                                                                query: `${params.apiUrl}/delete`,
                                                                body: JSON.stringify({
                                                                    ...params.query,
                                                                    messageIds: [...select.selectedMessages.keys()]
                                                                })
                                                            }),
                                                        {
                                                            closeOnError: true,
                                                            onResolve: select.handleCancelSelecting,
                                                            onReject: () => toast.error('Cannot delete messages')
                                                        }
                                                    )
                                                }
                                            />
                                        ),
                                        withHeader: false,
                                        bodyClassName: 'h-auto p-5'
                                    })
                                }
                                variant='ghost'
                                className='dark:text-red-500 dark:hover:bg-red-500/20 gap-2 ml-auto'
                            >
                                <Trash className='w-6 h-6 text-red-500' />
                                Delete
                            </Button>
                        </div>
                    </OutletHeaderContainer>
                ) : (
                    <OutletHeaderContainer className='cursor-pointer' onClick={() => onDetails(true)}>
                        <OutletHeader
                            name={recipient.name}
                            isOfficial={recipient.isOfficial}
                            description={getConversationDescription({ data: { recipient, isInitiatorBlocked, isRecipientBlocked }, isRecipientTyping })}
                            dropdownMenu={<ConversationDDM />}
                        />
                    </OutletHeaderContainer>
                )}
                {messages.length ? (
                    <MessagesListProvider
                        data={{
                            params,
                            lastMessageRef,
                            isContextActionsBlocked: isInitiatorBlocked || isRecipientBlocked,
                            ...select
                        }}
                    >
                        <MessagesList
                            ref={listRef}
                            messages={messages}
                            getPreviousMessages={getPreviousMessages}
                            isFetchingPreviousMessages={isPreviousMessagesLoading}
                            nextCursor={nextCursor}
                            canFetch={!isPreviousMessagesLoading && !!nextCursor}
                        />
                    </MessagesListProvider>
                ) : (
                    <Typography
                        variant='primary'
                        className='m-auto px-5 py-2 rounded-full dark:bg-primary-dark-50 bg-primary-white'
                    >
                        No messages yet
                    </Typography>
                )}
                <div className='flex flex-col sticky bottom-0 w-full'>
                    {isInitiatorBlocked || isRecipientBlocked ? (
                        <div className='w-full h-[70px] overflow-hidden flex items-center dark:bg-primary-dark-100 bg-primary-white transition-colors duration-200 ease-in-out box-border'>
                            <Typography variant='secondary' className='m-auto text-center'>
                                {isRecipientBlocked
                                    ? `You blocked ${recipient.name}`
                                    : `${recipient.name} has restricted incoming messages`}
                            </Typography>
                        </div>
                    ) : (
                        <SendMessage
                            showAnchor={showAnchor}
                            onAnchorClick={scrollToBottom}
                            onChange={handleTypingStatus}
                            params={params}
                        />
                    )}
                </div>
            </div>
            {showRecipientDetails && (
                <OutletDetails
                    name={recipient.name}
                    avatarSlot={
                        <Image
                            src={recipient.avatar?.url}
                            skeleton={<AvatarByName name={recipient.name} size='5xl' />}
                            className='object-cover object-center size-28 rounded-full'
                        />
                    }
                    description={getConversationDescription({
                        data: { recipient, isInitiatorBlocked, isRecipientBlocked },
                        isRecipientTyping,
                        shouldDisplayTypingStatus: false
                    })}
                    info={<RecipientDetails recipient={recipient} />}
                    type={FeedTypes.CONVERSATION}
                    onClose={() => onDetails(false)}
                />
            )}
        </OutletContainer>
    );
};