import React from 'react';
import { Button } from '@/shared/ui/Button';
import { Loader2 } from 'lucide-react';
import { MessagesListProps } from '../model/types';
import { GroupedMessages } from '@/features/GroupedMessages/ui/ui';
import { Message } from '@/entities/Message/model/types';
import { useMessagesList } from '../model/context';

export const MessagesList = React.forwardRef<HTMLUListElement, MessagesListProps>(({
    canFetch,
    messages,
    getPreviousMessages,
    nextCursor,
    isFetchingPreviousMessages,
}, ref) => {
    const { lastMessageRef } = useMessagesList();

    const groupedMessages = React.useMemo(() => messages.reduce<Array<Array<Message>>>((acc, message) => {
        const lastGroup = acc[acc.length - 1];

        lastGroup && lastGroup[0].sender._id === message.sender._id ? lastGroup.push(message) : acc.push([message]);

        return acc;
    }, []), [messages]);

    React.useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'instant' });
    }, [])

    return (
        <ul
            ref={ref}
            className='relative flex flex-col flex-1 w-full px-5 mb-auto max-xl:gap-5 gap-3 overflow-auto outline-none'
        >
            {nextCursor && (
                <li className='flex justify-center items-center'>
                    <Button
                        variant='text'
                        className='p-0 dark:text-primary-white/30 text-primary-white'
                        disabled={!canFetch}
                        onClick={getPreviousMessages}
                    >
                        {isFetchingPreviousMessages ? (
                            <Loader2 className='w-6 h-6 animate-spin' />
                        ) : (
                            'Load previous messages'
                        )}
                    </Button>
                </li>
            )}
            {groupedMessages.map((messages, index, array) => (
                <GroupedMessages
                    key={messages[0]._id}
                    messages={messages}
                    isLastGroup={index === array.length - 1}
                />
            ))}
        </ul>
    );
})