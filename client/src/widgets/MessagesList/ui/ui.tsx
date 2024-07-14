import React from 'react';
import MessageGroup from '@/widgets/MessageGroup/ui/ui';
import { Button } from '@/shared/ui/Button';
import { Loader2 } from 'lucide-react';
import { MessagesListProps } from '../model/types';
import { useMessagesList } from '../lib/hooks/useMessagesList';

const MessagesList = React.forwardRef<HTMLUListElement, MessagesListProps>(
    ({ messages, canFetch, getPreviousMessages, nextCursor, isFetchingPreviousMessages }, ref) => {
        const { groupedMessages, listRef, lastMessageRef } = useMessagesList({ messages, canFetch, getPreviousMessages });

        return (
            <ul ref={listRef} className='flex flex-col w-full px-5 py-3 mb-auto gap-5 h-svh overflow-auto'>
                {nextCursor && (
                    <Button
                        variant='text'
                        className='p-0 dark:text-primary-white/30 text-primary-white'
                        onClick={getPreviousMessages}
                    >
                        {isFetchingPreviousMessages ? (
                            <Loader2 className='w-6 h-6 animate-spin' />
                        ) : (
                            'Load previous messages'
                        )}
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
    }
);

export default MessagesList;
