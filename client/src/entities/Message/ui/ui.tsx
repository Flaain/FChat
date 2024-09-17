import React from 'react';
import { Typography } from '@/shared/ui/Typography';
import { cn } from '@/shared/lib/utils/cn';
import { MessageContextMenu } from './ContextMenu';
import { Check, CheckCheck } from 'lucide-react';
import { ContextMenu, ContextMenuTrigger } from '@/shared/ui/context-menu';
import { MessageProps } from '../model/types';
import { markdownCompiler } from '@/shared/lib/utils/markdownCompiler';
import { PartOfCompilerUse } from '@/shared/model/types';
import { getBubblesStyles } from '../lib/getBubblesStyles';

export const Message = React.forwardRef<HTMLLIElement, MessageProps>(
    ({ message, isFirst, isLast, isMessageFromMe, className, ...rest }, ref) => {
        const [isContextMenuOpen, setIsContextMenuOpen] = React.useState(false);

        const { createdAt, updatedAt, sender, text, hasBeenRead, hasBeenEdited, replyTo } = message;

        const createTime = new Date(createdAt);
        const editTime = new Date(updatedAt);

        const stylesForBottomIcon = cn(
            'w-4 h-4 mt-0.5',
            isMessageFromMe
                ? 'dark:text-primary-dark-200 text-primary-white'
                : 'dark:text-primary-white text-primary-dark-200'
        );

        return (
            <ContextMenu onOpenChange={setIsContextMenuOpen}>
                <ContextMenuTrigger asChild>
                    <li
                        {...rest}
                        ref={ref}
                        className={cn(
                            'flex gap-2',
                            isMessageFromMe ? 'self-end' : 'self-start',
                            !isMessageFromMe && isFirst && 'flex-col',
                            className
                        )}
                    >
                        {!isMessageFromMe && isFirst && (
                            <Typography variant='primary' weight='semibold'>
                                {sender.name}
                            </Typography>
                        )}
                        <div
                            className={cn(
                                'py-2 px-3 relative max-w-[500px]',
                                (replyTo === null || !!replyTo) && 'flex flex-col gap-2',
                                getBubblesStyles({
                                    isFirst,
                                    isLast,
                                    isMessageFromMe
                                })
                            )}
                        >
                            {(replyTo === null || !!replyTo) && (
                                <Typography
                                    as='p'
                                    weight='semibold'
                                    className={cn(
                                        'line-clamp-1 dark:text-primary-blue text-xs flex flex-col py-1 px-2 w-full rounded bg-primary-blue/10 border-l-4 border-solid border-primary-blue'
                                    )}
                                >
                                    {replyTo === null
                                        ? 'Deleted Message'
                                        : replyTo.refPath === 'User'
                                        ? replyTo.sender.name
                                        : replyTo.sender.name || replyTo.sender.user.name}
                                    {!!replyTo && (
                                        <Typography
                                            className={cn(
                                                'text-xs line-clamp-1',
                                                isMessageFromMe
                                                    ? 'dark:text-primary-dark-200 text-primary-white'
                                                    : 'dark:text-primary-white text-primary-dark-50'
                                            )}
                                        >
                                            {markdownCompiler(replyTo.text, PartOfCompilerUse.REPLY)}
                                        </Typography>
                                    )}
                                </Typography>
                            )}
                            <div className='flex items-center gap-2 flex-wrap'>
                                <Typography
                                    as='p'
                                    className={cn(
                                        'break-all overflow-y-hidden',
                                        isMessageFromMe ? 'dark:text-primary-dark-200' : 'text-primary-white'
                                    )}
                                >
                                    {markdownCompiler(text, PartOfCompilerUse.MESSAGE)}
                                </Typography>
                                <Typography
                                    size='sm'
                                    className={cn(
                                        'mt-0.5 ml-auto flex items-center gap-2',
                                        isMessageFromMe
                                            ? 'dark:text-primary-dark-50/20 text-primary-white'
                                            : 'dark:text-primary-white/20'
                                    )}
                                    title={`${createTime.toLocaleString()}${
                                        hasBeenEdited ? `\nEdited: ${editTime.toLocaleString()}` : ''
                                    }`}
                                >
                                    {new Date(createdAt).toLocaleTimeString(navigator.language ?? 'en-US', {
                                        timeStyle: 'short'
                                    })}
                                    {hasBeenEdited && ', edited'}
                                    {hasBeenRead ? (
                                        <CheckCheck className={stylesForBottomIcon} />
                                    ) : (
                                        <Check className={stylesForBottomIcon} />
                                    )}
                                </Typography>
                            </div>
                        </div>
                    </li>
                </ContextMenuTrigger>
                {isContextMenuOpen && (
                    <MessageContextMenu
                        message={message}
                        isMessageFromMe={isMessageFromMe}
                        onClose={() => setIsContextMenuOpen(false)}
                    />
                )}
            </ContextMenu>
        );
    }
);