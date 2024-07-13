import React from 'react';
import MessageGroup from '@/widgets/MessageGroup/ui/ui';
import { useConversationContext } from '@/pages/Conversation/lib/hooks/useConversationContext';
import { useMessagesList } from '../lib/hooks/useMessagesList';
import { IMessage } from '@/shared/model/types';
import { Button } from '@/shared/ui/Button';
import { Loader2 } from 'lucide-react';
import { usePreviousMessages } from '@/pages/Conversation/lib/hooks/usePreviousMessages';

const MessagesList = () => {
    const { data: { conversation, nextCursor } } = useConversationContext();
    const { conversationContainerRef, isLoading: previousMessagesLoading, getPreviousMessages } = usePreviousMessages();
    const { lastMessageRef } = useMessagesList();

    const groupedMessages = React.useMemo(() => conversation.messages.reduce((acc, message) => {
        const lastGroup = acc[acc.length - 1];

        lastGroup && lastGroup[0].sender._id === message.sender._id ? lastGroup.push(message) : acc.push([message]);

        return acc;
    }, [] as Array<Array<IMessage>>), [conversation.messages]);

    return (
        <ul ref={conversationContainerRef} className='flex flex-col w-full px-5 py-2 mb-auto gap-5 h-svh overflow-auto'>
            {nextCursor && (
                <Button
                    variant='text'
                    className='p-0 dark:text-primary-white/30 text-primary-white'
                    onClick={getPreviousMessages}
                >
                    {previousMessagesLoading ? <Loader2 className='w-6 h-6 animate-spin' /> : 'Load previous messages'}
                </Button>
            )}
            {groupedMessages.map((messages, index, array) => (
                <MessageGroup
                    key={messages[0]._id} // <-- not sure about this
                    messages={messages}
                    isLastGroup={index === array.length - 1}
                    lastMessageRef={lastMessageRef}
                />
            ))}
        </ul>
    );
};

export default MessagesList;
