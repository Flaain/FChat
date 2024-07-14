import React from 'react';
import Typography from '@/shared/ui/Typography';
import MessageContextMenu from './MessageContextMenu';
import { cn } from '@/shared/lib/utils/cn';
import { Check, CheckCheck } from 'lucide-react';
import { getRelativeTimeString } from '@/shared/lib/utils/getRelativeTimeString';
import { ContextMenu, ContextMenuTrigger } from '@/shared/ui/context-menu';
import { MessageProps } from '../model/types';

const Message = React.forwardRef<HTMLLIElement, MessageProps>(
    ({ message, isFirst, isLast, isMessageFromMe, className, ...rest }, ref) => {
        const { createdAt, updatedAt, sender, text, hasBeenRead, hasBeenEdited } = message;

        const createTime = new Date(createdAt);
        const editTime = new Date(updatedAt);

        const stylesForBottomIcon = cn('w-4 h-4 mt-0.5', {
            'dark:text-primary-white text-primary-dark-200': !isMessageFromMe,
            'dark:text-primary-dark-200 text-primary-white': isMessageFromMe
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
                            className={cn('px-5 py-1 relative max-w-[500px] flex items-end gap-3 self-start', {
                                'dark:bg-primary-dark-50 bg-primary-white': !isMessageFromMe,
                                'dark:bg-primary-white dark:text-primary-dark-200 self-end': isMessageFromMe,
                                'rounded-es-[5px] rounded-ss-[15px] rounded-se-[15px] rounded-ee-[15px]': !isLast && !isMessageFromMe,
                                'rounded-es-[0px] rounded-ss-[15px] rounded-se-[15px] rounded-ee-[15px] relative before:absolute before:w-[20px] before:h-[15px] before:-bottom-0 before:bg-transparent before:-left-5 before:rounded-br-3xl dark:before:shadow-[13px_0_0_#424242] before:shadow-[13px_0_0_#EEE]': isLast && !isMessageFromMe,
                                'rounded-es-[15px] rounded-ss-[15px] rounded-se-[15px] rounded-ee-[5px]': !isLast && isMessageFromMe,
                                'rounded-es-[15px] rounded-ss-[15px] rounded-se-[15px] rounded-ee-[0px] relative before:absolute before:w-[20px] before:h-[15px] before:-bottom-0 before:bg-transparent before:-right-5 before:rounded-bl-3xl dark:before:shadow-[-13px_0_0_#F9F9F9]': isLast && isMessageFromMe
                            })}
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
                                        'flex self-end items-center gap-5',
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
                            {hasBeenRead ? (
                                <CheckCheck className={stylesForBottomIcon} />
                            ) : (
                                <Check className={stylesForBottomIcon} />
                            )}
                                </Typography>
                            </Typography>
                        </div>
                    </ContextMenuTrigger>
                </li>
                <MessageContextMenu message={message} isMessageFromMe={isMessageFromMe} />
            </ContextMenu>
        );
    }
);

export default Message;