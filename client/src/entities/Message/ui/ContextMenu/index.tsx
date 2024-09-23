import React from 'react';
import { Typography } from '@/shared/ui/Typography';
import { ContextMenuContent, ContextMenuItem } from '@/shared/ui/context-menu';
import { Copy, Edit2, Reply, Trash2 } from 'lucide-react';
import { useMessage } from '../../lib/useMessage';
import { ContextMenuProps } from '../../model/types';
import { ModalConfig, useModal } from '@/shared/lib/providers/modal';
import { Confirm } from '@/shared/ui/Confirm';
import { useEvents } from '@/shared/lib/providers/events/context';
import { useLayout } from '@/shared/lib/providers/layout/context';

export const MessageContextMenu = ({ message, isMessageFromMe, onClose }: ContextMenuProps) => {
    const { handleCopyToClipboard, handleMessageDelete, handleContextAction } = useMessage(message);
    const { textareaRef } = useLayout();
    const { onOpenModal, onCloseModal } = useModal();
    const { addEventListener } = useEvents();

    const confirmationConfig: ModalConfig = {
        content: (
            <Confirm
                onCancel={onCloseModal}
                onConfirm={handleMessageDelete}
                onConfirmText='Delete'
                text='Are you sure you want to delete this message?'
                onConfirmButtonVariant='destructive'
            />
        ),
        withHeader: false,
        bodyClassName: 'h-auto p-5 w-[400px]'
    };

    React.useEffect(() => {
        const removeEventListener = addEventListener('keydown', (event) => {
            event.key === 'Escape' && onClose();
        });

        return () => {
            removeEventListener();
        };
    }, []);

    return (
        <ContextMenuContent
            onEscapeKeyDown={(event) => event.preventDefault()}
            onCloseAutoFocus={() => textareaRef.current?.focus()}
            asChild
            loop
            className='z-[999] w-52 dark:bg-primary-dark-150 bg-primary-white border border-solid dark:border-primary-dark-200 border-primary-white rounded-md flex flex-col p-1'
        >
            <ul>
                <ContextMenuItem
                    asChild
                    className='flex items-center gap-5 dark:text-primary-white text-primary-dark-200 rounded-md dark:hover:bg-primary-dark-200 focus:bg-primary-gray dark:focus:bg-primary-dark-200 hover:bg-primary-gray'
                    onClick={() => handleContextAction({ state: 'reply', value: '', selectedMessage: message })}
                >
                    <li>
                        <Reply className='w-4 h-4' />
                        <Typography size='sm'>Reply</Typography>
                    </li>
                </ContextMenuItem>
                <ContextMenuItem
                    asChild
                    className='flex items-center gap-5 dark:text-primary-white text-primary-dark-200 rounded-md dark:hover:bg-primary-dark-200 focus:bg-primary-gray dark:focus:bg-primary-dark-200 hover:bg-primary-gray'
                    onClick={handleCopyToClipboard}
                >
                    <li>
                        <Copy className='w-4 h-4' />
                        <Typography size='sm'>Copy</Typography>
                    </li>
                </ContextMenuItem>
                {isMessageFromMe && (
                    <>
                        <ContextMenuItem
                            asChild
                            className='flex items-center gap-5 dark:text-primary-white text-primary-dark-200 rounded-md dark:hover:bg-primary-dark-200 focus:bg-primary-gray dark:focus:bg-primary-dark-200 hover:bg-primary-gray'
                            onClick={() =>
                                handleContextAction({ state: 'edit', value: message.text, selectedMessage: message })
                            }
                        >
                            <li>
                                <Edit2 className='w-4 h-4' />
                                <Typography size='sm'>Edit</Typography>
                            </li>
                        </ContextMenuItem>
                        <ContextMenuItem
                            asChild
                            className='flex transition-colors ease-in-out duration-200 items-center gap-5 dark:text-primary-white text-primary-dark-200 rounded-md dark:hover:bg-primary-destructive/10 focus:bg-primary-gray dark:focus:bg-primary-destructive/10 hover:bg-primary-gray'
                            onClick={() => onOpenModal(confirmationConfig)}
                        >
                            <li>
                                <Trash2 className='w-4 h-4 text-red-400' />
                                <Typography className='dark:text-red-400' size='sm'>
                                    Delete
                                </Typography>
                            </li>
                        </ContextMenuItem>
                    </>
                )}
            </ul>
        </ContextMenuContent>
    );
};