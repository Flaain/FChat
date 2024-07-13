import React from 'react';
import Typography from '@/shared/ui/Typography';
import MessageContextMenu from './MessageContextMenu';
import { cn } from '@/shared/lib/utils/cn';
import { Check, CheckCheck } from 'lucide-react';
import { getRelativeTimeString } from '@/shared/lib/utils/getRelativeTimeString';
import { ContextMenu, ContextMenuTrigger } from '@/shared/ui/context-menu';
import { MessageProps } from '../model/types';

const Message = React.forwardRef<HTMLLIElement, MessageProps>(({ message, isFirst, isLast, isMessageFromMe, className, ...rest }, ref) => {
    const { createdAt, updatedAt, sender, text, hasBeenRead, hasBeenEdited } = message;

    const createTime = new Date(createdAt);
    const editTime = new Date(updatedAt);

    const stylesForBottomIcon = cn('w-4 h-4 absolute right-5 bottom-1', {
        'dark:text-primary-white text-primary-dark-200 w-4 h-4': !isMessageFromMe,
        'dark:text-primary-dark-200 text-primary-white w-4 h-4': isMessageFromMe
    });

    return (
        <ContextMenu>
            <li {...rest} ref={ref} className={cn('flex', isMessageFromMe ? 'self-end' : 'self-start', className)}>
                <ContextMenuTrigger className={cn('flex gap-2', !isMessageFromMe && isFirst && 'flex-col')}>
                    {!isMessageFromMe && isFirst && (
                        <Typography variant='primary' weight='semibold'>
                            {sender.name}
                        </Typography>
                    )}
                    <div
                        className={cn(
                            'pl-5 pr-12 py-1 relative max-w-[500px] flex items-end gap-3 self-start',
                            {
                                'dark:bg-primary-dark-50 bg-primary-white': !isMessageFromMe,
                                'dark:bg-primary-white dark:text-primary-dark-200 self-end': isMessageFromMe,
                                'rounded-es-[5px] rounded-ss-[15px] rounded-se-[15px] rounded-ee-[15px]': !isLast,
                                'rounded-es-[0px] rounded-ss-[5px] rounded-se-[15px] rounded-ee-[15px] relative before:absolute before:w-[20px] before:h-[15px] before:-bottom-0 before:bg-transparent before:-left-5 before:rounded-br-3xl before:shadow-[13px_0_0_#424242]': isLast,
                            }
                        )}
                    >
                        <Typography
                            as='p'
                            className={cn(
                                'inline-flex flex-col',
                                !isMessageFromMe
                                    ? 'dark:text-primary-white text-primary-dark-200'
                                    : 'dark:text-primary-dark-200 text-primary-white'
                            )}
                        >
                            {text}
                            <Typography
                                className={cn(
                                    'self-end ml-auto cursor-default',
                                    isMessageFromMe
                                        ? 'dark:text-primary-dark-50/20 text-primary-white'
                                        : 'dark:text-primary-white/20'
                                )}
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
                        </Typography>
                        {hasBeenRead ? (
                            <CheckCheck className={stylesForBottomIcon} />
                        ) : (
                            <Check className={stylesForBottomIcon} />
                        )}
                    </div>
                </ContextMenuTrigger>
            </li>
            <MessageContextMenu message={message} isMessageFromMe={isMessageFromMe} />
        </ContextMenu>
    );
});

export default Message;