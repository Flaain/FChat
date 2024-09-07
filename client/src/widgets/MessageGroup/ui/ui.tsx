import Message from '@/entities/Message/ui/ui';
import AvatarByName from '@/shared/ui/AvatarByName';
import { MessageGroupProps } from '../model/types';
import { useSession } from '@/entities/session/lib/hooks/useSession';
import { cn } from '@/shared/lib/utils/cn';

const MessageGroup = ({ messages, isLastGroup, lastMessageRef, type }: MessageGroupProps) => {
    const { state: { userId } } = useSession();

    const sender = messages[0].sender;
    const isMessageFromMe = sender._id === userId;

    return (
        <li className={cn('flex items-end gap-3', isMessageFromMe ? 'self-end' : 'self-start')}>
            {!isMessageFromMe &&
                (sender.avatar ? (
                    <img className='object-cover size-10 sticky bottom-0 rounded-full' src={sender.avatar.url} />
                ) : (
                    <AvatarByName name={sender.name} className='sticky bottom-0' />
                ))}
            <ul className='flex flex-col gap-1'>
                {messages.map((message, index, array) => (
                    <Message
                        type={type}
                        key={message._id}
                        isFirst={!index}
                        isMessageFromMe={isMessageFromMe}
                        isLast={index === array.length - 1}
                        message={message}
                        ref={isLastGroup && index === array.length - 1 ? lastMessageRef : null}
                    />
                ))}
            </ul>
        </li>
    );
};

export default MessageGroup;
