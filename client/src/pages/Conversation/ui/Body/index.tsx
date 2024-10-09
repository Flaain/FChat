import { Typography } from '@/shared/ui/Typography';
import { MessagesList } from '@/widgets/MessagesList';
import { useConversation } from '../../model/context';
import { useShallow } from 'zustand/shallow';
import { useChat } from '@/shared/lib/providers/chat/context';

export const ConversationBody = () => {
    const { messages, nextCursor, isPreviousMessagesLoading, actions } = useConversation(useShallow((state) => ({
        messages: state.data.conversation.messages,
        nextCursor: state.data.nextCursor,
        actions: state.actions,
        isPreviousMessagesLoading: state.isPreviousMessagesLoading
    })));

    const listRef = useChat((state) => state.refs.listRef);

    return (
        <>
            {messages.length ? (
                <MessagesList
                    ref={listRef}
                    messages={messages}
                    getPreviousMessages={actions.getPreviousMessages}
                    isFetchingPreviousMessages={isPreviousMessagesLoading}
                    nextCursor={nextCursor}
                    canFetch={!isPreviousMessagesLoading && !!nextCursor}
                />
            ) : (
                <Typography
                    variant='primary'
                    className='m-auto px-5 py-2 rounded-full dark:bg-primary-dark-50 bg-primary-white'
                >
                    No messages yet
                </Typography>
            )}
        </>
    );
};