import MessageGroup from '@/features/MessageGroup/ui/ui';
import { Button } from '@/shared/ui/Button';
import { Loader2 } from 'lucide-react';
import { MessagesListProps } from '../model/types';
import { useMessagesList } from '../lib/useMessagesList';

const MessagesList = ({ messages, canFetch, getPreviousMessages, nextCursor, isContextActionsBlocked, isFetchingPreviousMessages }: MessagesListProps) => {
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
                <MessageGroup
                    key={messages[0]._id}
                    isContextActionsBlocked={isContextActionsBlocked}
                    messages={messages}
                    isLastGroup={index === array.length - 1}
                    lastMessageRef={lastMessageRef}
                />
            ))}
        </ul>
    );
};

export default MessagesList;
