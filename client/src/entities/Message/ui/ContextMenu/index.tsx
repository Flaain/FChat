import React from 'react';
import { Typography } from '@/shared/ui/Typography';
import { ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from '@/shared/ui/context-menu';
import { CircleCheckBig, Copy, Edit2, Reply, Trash2 } from 'lucide-react';
import { useMessage } from '../../lib/useMessage';
import { ContextMenuProps } from '../../model/types';
import { ModalConfig, useModal } from '@/shared/lib/providers/modal';
import { Confirm } from '@/shared/ui/Confirm';
import { selectModalActions } from '@/shared/lib/providers/modal/store';
import { useEvents } from '@/shared/model/store';
import { useShallow } from 'zustand/shallow';
import { useChat } from '@/shared/lib/providers/chat/context';
import { getRelativeTimeString } from '@/shared/lib/utils/getRelativeTimeString';

export const MessageContextMenu = ({ message, isMessageFromMe, onClose }: ContextMenuProps) => {
    const { handleCopyToClipboard, handleMessageDelete, handleContextAction } = useMessage(message);
    const { onOpenModal, onCloseModal } = useModal(useShallow(selectModalActions));
    const { textareaRef, handleSelectMessage } = useChat(useShallow((state) => ({
        textareaRef: state.refs.textareaRef,
        handleSelectMessage: state.actions.handleSelectMessage
    })));

    const addEventListener = useEvents((state) => state.addEventListener);

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
            className='z-[999] w-auto min-w-[200px] py-2 px-1 dark:bg-menu-background-color backdrop-blur-[50px] bg-primary-white border border-solid dark:border-primary-dark-200 border-primary-white rounded-[10px] flex flex-col'
        >
            <div>
                <Typography className='px-2' size='sm'>
                    {getRelativeTimeString(new Date(message.createdAt), 'en-US')}
                </Typography>
                <ContextMenuSeparator className='dark:bg-primary-dark-50'/>
                <ul>
                    <ContextMenuItem
                        asChild
                        className='active:scale-95 flex items-center gap-5 transition-colors ease-in-out duration-200 dark:text-primary-white text-primary-dark-200 rounded-md dark:hover:bg-light-secondary-color focus:bg-primary-gray dark:focus:bg-light-secondary-color hover:bg-primary-gray'
                        onClick={() => handleContextAction({ state: 'reply', value: '', selectedMessage: message })}
                    >
                        <li>
                            <Reply className='w-4 h-4' />
                            <Typography size='sm' weight='medium'>Reply</Typography>
                        </li>
                    </ContextMenuItem>
                    <ContextMenuItem
                        asChild
                        className='active:scale-95 flex items-center gap-5 transition-colors ease-in-out duration-200 dark:text-primary-white text-primary-dark-200 rounded-md dark:hover:bg-light-secondary-color focus:bg-primary-gray dark:focus:bg-light-secondary-color hover:bg-primary-gray'
                        onClick={handleCopyToClipboard}
                    >
                        <li>
                            <Copy className='w-4 h-4' />
                            <Typography size='sm' weight='medium'>Copy</Typography>
                        </li>
                    </ContextMenuItem>
                    {isMessageFromMe && (
                        <>
                            <ContextMenuItem
                                asChild
                                className='active:scale-95 flex items-center gap-5 transition-colors ease-in-out duration-200 dark:text-primary-white text-primary-dark-200 rounded-md dark:hover:bg-light-secondary-color focus:bg-primary-gray dark:focus:bg-light-secondary-color hover:bg-primary-gray'
                                onClick={() =>
                                    handleContextAction({
                                        state: 'edit',
                                        value: message.text,
                                        selectedMessage: message
                                    })
                                }
                            >
                                <li>
                                    <Edit2 className='w-4 h-4' />
                                    <Typography size='sm' weight='medium'>Edit</Typography>
                                </li>
                            </ContextMenuItem>
                            <ContextMenuItem
                                asChild
                                className='active:scale-95 flex items-center gap-5 transition-colors ease-in-out duration-200 dark:text-primary-white text-primary-dark-200 rounded-md dark:hover:bg-light-secondary-color focus:bg-primary-gray dark:focus:bg-light-secondary-color hover:bg-primary-gray'
                                onClick={() => handleSelectMessage(message)}
                            >
                                <li>
                                    <CircleCheckBig className='w-4 h-4' />
                                    <Typography size='sm' weight='medium'>Select</Typography>
                                </li>
                            </ContextMenuItem>
                            <ContextMenuItem
                                asChild
                                className='active:scale-95 flex transition-colors ease-in-out duration-200 items-center gap-5 dark:text-primary-white text-primary-dark-200 rounded-md dark:hover:bg-primary-destructive/10 focus:bg-primary-gray dark:focus:bg-primary-destructive/10 hover:bg-primary-gray'
                                onClick={() => onOpenModal(confirmationConfig)}
                            >
                                <li>
                                    <Trash2 className='w-4 h-4 text-red-400' />
                                    <Typography className='dark:text-red-400' size='sm' weight='medium'>
                                        Delete
                                    </Typography>
                                </li>
                            </ContextMenuItem>
                        </>
                    )}
                </ul>
            </div>
        </ContextMenuContent>
    );
};