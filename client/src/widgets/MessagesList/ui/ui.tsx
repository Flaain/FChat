import Message from '@/entities/Message/ui/ui';
import { useConversationContext } from '@/pages/Conversation/lib/hooks/useConversationContext';
import { useMessagesList } from '../lib/hooks/useMessagesList';

const MessagesList = () => {
    const { conversation: { conversation: { messages } } } = useConversationContext();
    const { lastMessageRef } = useMessagesList();

    return (
        <ul className='flex flex-col w-full px-5 gap-10 mb-auto'>
            {messages.map((message, index, array) => (
                <Message
                    key={message._id}
                    message={message}
                    ref={index === array.length - 1 ? lastMessageRef : null}
                />
            ))}
        </ul>
    );
};

export default MessagesList;