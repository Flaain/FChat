import React from 'react';
import Typography from '@/shared/ui/Typography';
import AvatarByName from '@/shared/ui/AvatarByName';
import Confirmation from '@/shared/ui/Confirmation';
import { cn } from '@/shared/lib/utils/cn';
import { IMessage } from '@/shared/model/types';
import { Check, CheckCheck, Clock, Copy, Edit2, Trash2 } from 'lucide-react';
import { getRelativeTimeString } from '@/shared/lib/utils/getRelativeTimeString';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/shared/ui/context-menu';
import { useMessage } from '../lib/hooks/useMessage';
import { useModal } from '@/shared/lib/hooks/useModal';
import { ModalConfig } from '@/shared/lib/contexts/modal/types';

const Message = React.forwardRef<HTMLLIElement, { message: IMessage }>(({ message }, ref) => {
    const { createTime, isMessageFromMe, handleCopyToClipboard, handleMessageDelete, handleMessageEdit } = useMessage(message);
    const { openModal, closeModal, onAsyncActionCall } = useModal();
    const { sender, text, hasBeenRead, sendingInProgress } = message;

    const stylesForBottomIcon = cn('w-4 h-4', {
        'dark:text-primary-white text-primary-dark-200 w-4 h-4': !isMessageFromMe,
        'dark:text-primary-dark-200 text-primary-white w-4 h-4': isMessageFromMe
    });

    const confirmationConfig: ModalConfig = {
        content: (
            <Confirmation
                onCancel={closeModal}
                onConfirm={() => onAsyncActionCall({ asyncAction: handleMessageDelete, errorMessage: 'Cannot delete message' })}
                onConfirmText='Delete'
                text='Are you sure you want to delete this message?'
            />
        ),
        title: 'Delete message',
        size: 'fit',
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger className={cn({ 'self-end': isMessageFromMe, 'self-start': !isMessageFromMe })}>
                <li ref={ref} className='flex items-center gap-5'>
                    {!isMessageFromMe && <AvatarByName name={sender.name} className='self-end' />}
                    <div className='flex flex-col'>
                        <div className='flex items-center gap-5'>
                            {!isMessageFromMe && (
                                <Typography as='h3' variant='primary' weight='medium'>
                                    {sender.name}
                                </Typography>
                            )}
                            <Typography
                                className='self-end ml-auto'
                                variant='secondary'
                                title={createTime.toLocaleString()}
                            >
                                {getRelativeTimeString(createTime, 'en-US')},&nbsp;
                                {createTime.toLocaleTimeString(navigator.language, {
                                    hour: 'numeric',
                                    minute: 'numeric'
                                })}
                            </Typography>
                        </div>
                        <Typography
                            as='p'
                            className={cn('px-5 py-1 rounded-xl mt-2 max-w-[500px] flex items-end gap-3 self-start', {
                                'dark:bg-primary-dark-50 bg-primary-white dark:text-primary-white': !isMessageFromMe,
                                'dark:bg-primary-white dark:text-primary-dark-200 self-end': isMessageFromMe
                            })}
                        >
                            {text}
                            {sendingInProgress ? (
                                <Clock className={stylesForBottomIcon} />
                            ) : (
                                <Typography title={hasBeenRead ? 'message was read' : 'message not read yet'}>
                                    {hasBeenRead ? (
                                        <CheckCheck className={stylesForBottomIcon} />
                                    ) : (
                                        <Check className={stylesForBottomIcon} />
                                    )}
                                </Typography>
                            )}
                        </Typography>
                    </div>
                </li>
            </ContextMenuTrigger>
            <ContextMenuContent className='w-52 dark:bg-primary-dark-150 bg-primary-white border border-solid dark:border-primary-dark-200 border-primary-white rounded-md flex flex-col gap-2 p-1'>
                <ContextMenuItem
                    onClick={handleCopyToClipboard}
                    className='flex items-center justify-between gap-2 dark:text-primary-white text-primary-dark-200 rounded-md dark:hover:bg-primary-dark-200 focus:bg-primary-gray dark:focus:bg-primary-dark-200 hover:bg-primary-gray'
                >
                    Copy <Copy className='w-4 h-4' />
                </ContextMenuItem>
                {isMessageFromMe && (
                    <>
                        <ContextMenuItem
                            onClick={handleMessageEdit}
                            className='flex items-center justify-between gap-2 dark:text-primary-white text-primary-dark-200 rounded-md dark:hover:bg-primary-dark-200 hover:bg-primary-gray dark:focus:bg-primary-dark-200 focus:bg-primary-gray'
                        >
                            Edit <Edit2 className='w-4 h-4' />
                        </ContextMenuItem>
                        <ContextMenuItem
                            onClick={() => openModal(confirmationConfig)}
                            className='flex items-center justify-between gap-2 dark:text-primary-white text-primary-dark-200 rounded-md dark:hover:bg-primary-dark-200 hover:bg-primary-gray dark:focus:bg-primary-dark-200 focus:bg-primary-gray'
                        >
                            Delete <Trash2 className='w-4 h-4' />
                        </ContextMenuItem>
                    </>
                )}
            </ContextMenuContent>
        </ContextMenu>
    );
});

export default Message;