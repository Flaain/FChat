import { AvatarByName } from '@/shared/ui/AvatarByName';
import { Image } from '@/shared/ui/Image';
import { MessageGroupProps } from '../model/types';
import { cn } from '@/shared/lib/utils/cn';
import { Message } from '@/entities/Message';
import { useSession } from '@/entities/session';

export const GroupedMessages = ({ messages, isLastGroup, lastMessageRef }: MessageGroupProps) => {
    const { userId } = useSession();
    
    const message = messages[0];
    const isUser = message.refPath === 'User';
    const isMessageFromMe = isUser ? message.sender._id === userId : false; // TODO: add participant store
    
    return (
        <li className={cn('flex items-end gap-3', isMessageFromMe ? 'self-end' : 'self-start')}>
            {!isMessageFromMe && (
                <Image
                    src={isUser ? message.sender.avatar?.url : (message.sender.avatar?.url || message.sender.user.avatar?.url)}
                    skeleton={<AvatarByName name={isUser ? message.sender.name : (message.sender.name || message.sender.user.name)} className='sticky bottom-0' />}
                    className='object-cover size-10 sticky bottom-0 rounded-full'
                />
            )}
            <ul className='flex flex-col gap-1'>
                {messages.map((message, index, array) => (
                    <Message
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