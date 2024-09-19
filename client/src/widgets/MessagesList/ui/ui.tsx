import { Button } from '@/shared/ui/Button';
import { Loader2 } from 'lucide-react';
import { MessagesListProps } from '../model/types';
import { useMessagesList } from '../lib/useMessagesList';
import { GroupedMessages } from '@/features/GroupedMessages/ui/ui';

export const MessagesList = ({ messages, canFetch, getPreviousMessages, nextCursor, isFetchingPreviousMessages }: MessagesListProps) => {
    const { groupedMessages, lastMessageRef, ref } = useMessagesList({ messages, canFetch, getPreviousMessages });
    
    return (
        <ul ref={ref} className='relative flex flex-col flex-1 w-full px-5 mb-auto gap-5 overflow-auto outline-none'>
            {nextCursor && (
                <li className='flex justify-center items-center'>
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
                </li>
            )}
            {groupedMessages.map((messages, index, array) => (
                <GroupedMessages
                    key={messages[0]._id}
                    messages={messages}
                    isLastGroup={index === array.length - 1}
                    lastMessageRef={lastMessageRef}
                />
            ))}
        </ul>
    );
};