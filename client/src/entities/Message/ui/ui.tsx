import React, { HTMLAttributes } from 'react';
import Typography from '@/shared/ui/Typography';
import AvatarByName from '@/shared/ui/AvatarByName';
import MessageContextMenu from './MessageContextMenu';
import { cn } from '@/shared/lib/utils/cn';
import { IMessage } from '@/shared/model/types';
import { Check, CheckCheck } from 'lucide-react';
import { getRelativeTimeString } from '@/shared/lib/utils/getRelativeTimeString';
import { ContextMenu, ContextMenuTrigger } from '@/shared/ui/context-menu';
import { useSession } from '@/entities/session/lib/hooks/useSession';

const Message = React.forwardRef<HTMLLIElement, HTMLAttributes<HTMLLIElement> & { message: IMessage }>(({ message, className, ...rest }, ref) => {
    const { createdAt, updatedAt, sender, text, hasBeenRead, hasBeenEdited } = message;
    const { state: { userId } } = useSession();

    const createTime = new Date(createdAt);
    const editTime = new Date(updatedAt);

    const isMessageFromMe = sender._id === userId;

    const stylesForBottomIcon = cn('w-4 h-4 absolute right-5 bottom-1', {
        'dark:text-primary-white text-primary-dark-200 w-4 h-4': !isMessageFromMe,
        'dark:text-primary-dark-200 text-primary-white w-4 h-4': isMessageFromMe
    });

    return (
        <ContextMenu>
            <li {...rest} ref={ref} className={cn('flex', isMessageFromMe ? 'justify-end' : 'justify-start', className)}>
                <ContextMenuTrigger className='flex gap-5'>
                    {!isMessageFromMe && <AvatarByName name={sender.name} className='self-end' />}
                    <div className='flex flex-col'>
                        <div className='flex items-center gap-5'>
                            {!isMessageFromMe && (
                                <Typography as='h3' variant='primary' weight='medium'>
                                    {sender.name}
                                </Typography>
                            )}
                            <Typography
                                className='self-end ml-auto cursor-default'
                                variant='secondary'
                                title={`${createTime.toLocaleString()}${
                                    hasBeenEdited ? `\nEdited: ${editTime.toLocaleString()}` : ''
                                }`}
                            >
                                {getRelativeTimeString(createTime, 'en-US')},&nbsp;
                                {createTime.toLocaleTimeString(navigator.language, {
                                    hour: 'numeric',
                                    minute: 'numeric'
                                })}
                                {hasBeenEdited && (
                                    <Typography variant='secondary' size='sm'>
                                        , edited
                                    </Typography>
                                )}
                            </Typography>
                        </div>
                        <div
                            className={cn('pl-5 pr-12 py-1 relative rounded-xl mt-2 max-w-[500px] flex items-end gap-3 self-start', {
                                'dark:bg-primary-dark-50 bg-primary-white': !isMessageFromMe,
                                'dark:bg-primary-white dark:text-primary-dark-200 self-end': isMessageFromMe
                            })}
                        >
                            <Typography
                                as='p'
                                className={cn(
                                    !isMessageFromMe
                                        ? 'dark:text-primary-white text-primary-dark-200'
                                        : 'dark:text-primary-dark-200 text-primary-white'
                                )}
                            >
                                {text}
                            </Typography>
                            {hasBeenRead ? (
                                <CheckCheck className={stylesForBottomIcon} />
                            ) : (
                                <Check className={stylesForBottomIcon} />
                            )}
                        </div>
                    </div>
                </ContextMenuTrigger>
            </li>
            <MessageContextMenu message={message} isMessageFromMe={isMessageFromMe} />
        </ContextMenu>
    );
});

export default Message;