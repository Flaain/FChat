import Message from '@/entities/Message/ui/ui';
import { useConversationContext } from '@/pages/Conversation/lib/hooks/useConversationContext';
import { useMessagesList } from '../lib/hooks/useMessagesList';
import { cn } from '@/shared/lib/utils/cn';

const MessagesList = () => {
    const { data: { conversation } } = useConversationContext();
    const { lastMessageRef } = useMessagesList();

    return (
        <ul className='flex flex-col w-full px-5 mb-auto'>
            {conversation.messages.map((message, index, array) => (
                <Message
                    key={message._id}
                    message={message}
                    ref={index === array.length - 1 ? lastMessageRef : null}
                    className={cn(array[index + 1]?.sender._id === message.sender._id ? 'mb-3' : 'mb-8')}
                />
            ))}
        </ul>
    );
};

export default MessagesList;