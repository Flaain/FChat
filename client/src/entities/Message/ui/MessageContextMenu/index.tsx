import React from 'react';
import Confirm from '@/widgets/Confirm/ui/ui';
import Typography from '@/shared/ui/Typography';
import { ModalConfig } from '@/shared/lib/contexts/modal/types';
import { useModal } from '@/shared/lib/hooks/useModal';
import { ContextMenuContent, ContextMenuItem } from '@/shared/ui/context-menu';
import { Copy, Edit2, Reply, Trash2 } from 'lucide-react';
import { IMessage } from '@/shared/model/types';
import { useMessage } from '../../lib/hooks/useMessage';
import { useLayoutContext } from '@/shared/lib/hooks/useLayoutContext';
import { useDomEvents } from '@/shared/lib/hooks/useDomEvents';

const MessageContextMenu = ({
    message,
    isMessageFromMe,
    closeContextMenu
}: {
    message: IMessage;
    isMessageFromMe: boolean;
    closeContextMenu: () => void;
}) => {
    const { addEventListener } = useDomEvents();
    const { handleCopyToClipboard, handleMessageDelete, handleContextAction } = useMessage(message);
    const { openModal, closeModal } = useModal();
    const { textareaRef } = useLayoutContext();

    const confirmationConfig: ModalConfig = {
        content: (
            <Confirm
                onCancel={closeModal}
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
            event.stopImmediatePropagation();

            event.key === 'Escape' && closeContextMenu();
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
                            onClick={() => openModal(confirmationConfig)}
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

export default MessageContextMenu;