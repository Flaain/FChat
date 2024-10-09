import React from 'react';
import { Button } from '@/shared/ui/Button';
import { Loader2 } from 'lucide-react';
import { MessagesListProps } from '../model/types';
import { GroupedMessages } from '@/features/GroupedMessages/ui/ui';
import { useMessagesList } from '../model/useMessagesList';

export const MessagesList = React.forwardRef<HTMLUListElement, MessagesListProps>(({
    canFetch,
    messages,
    getPreviousMessages,
    nextCursor,
    isFetchingPreviousMessages,
}, ref) => {
    const groupedMessages = useMessagesList({ canFetch, messages, getPreviousMessages });

    return (
        <ul
            ref={ref}
            className='relative flex flex-col flex-1 w-full px-5 mb-auto max-xl:gap-5 gap-3 overflow-x-hidden overflow-y-auto outline-none'
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