import React from 'react';
import Typography from '@/shared/ui/Typography';
import MessageContextMenu from './MessageContextMenu';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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

        const stylesForBottomIcon = cn(
            'w-4 h-4 mt-0.5',
            isMessageFromMe
                ? 'dark:text-primary-dark-200 text-primary-white'
                : 'dark:text-primary-white text-primary-dark-200'
        );

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
                                'px-5 py-1 relative max-w-[500px] flex flex-col items-end rounded-ss-[15px] rounded-se-[15px]',
                                {
                                    [`self-end dark:bg-primary-white dark:text-primary-dark-200 ${
                                        isLast
                                            ? 'before:-right-5 dark:before:shadow-[-13px_0_0_#F9F9F9] rounded-es-[15px] rounded-ee-[0px] relative before:absolute before:w-[20px] before:h-[15px] before:bg-transparent before:-bottom-0 before:rounded-bl-3xl'
                                            : 'rounded-es-[15px] rounded-ee-[5px]'
                                    }`]: isMessageFromMe,
                                    [`self-start dark:bg-primary-dark-50 bg-primary-white ${
                                        isLast
                                            ? 'before:-left-5 dark:before:shadow-[13px_0_0_#424242] before:shadow-[13px_0_0_#EEE] rounded-es-[0px] rounded-ee-[15px] relative before:absolute before:w-[20px] before:h-[15px] before:bg-transparent before:-bottom-0 before:rounded-br-3xl'
                                            : 'rounded-es-[5px] rounded-ee-[15px]'
                                    }`]: !isMessageFromMe
                                }
                            )}
                        >
                            <ReactMarkdown
                                components={{
                                    a: (props) => <a target='_blank' rel='noreferrer' className='text-primary-blue hover:underline' {...props} />,
                                }}
                                remarkPlugins={[remarkGfm]}
                                className={cn(
                                    'inline-flex flex-col break-all',
                                    !isMessageFromMe
                                        ? 'self-start dark:text-primary-white text-primary-dark-200'
                                        : 'self-end dark:text-primary-dark-200 text-primary-white'
                                )}
                            >
                                {text}
                            </ReactMarkdown>
                            <Typography
                                className={cn('flex self-end items-center gap-5')}
                                title={`${createTime.toLocaleString()}${
                                    hasBeenEdited ? `\nEdited: ${editTime.toLocaleString()}` : ''
                                }`}
                            >
                                <Typography
                                    className={cn('flex items-center gap-2',
                                        isMessageFromMe
                                            ? 'dark:text-primary-dark-50/20 text-primary-white'
                                            : 'dark:text-primary-white/20'
                                    )}
                                >
                                    {getRelativeTimeString(createTime, 'en-US')}
                                    {hasBeenEdited && (
                                        <Typography
                                            className={cn(
                                                isMessageFromMe
                                                    ? 'dark:text-primary-dark-50/20 text-primary-white'
                                                    : 'dark:text-primary-white/20'
                                            )}
                                            size='sm'
                                        >
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