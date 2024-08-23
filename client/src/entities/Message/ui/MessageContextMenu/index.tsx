import Confirm from '@/widgets/Confirm/ui/ui';
import { ModalConfig } from '@/shared/lib/contexts/modal/types';
import { useModal } from '@/shared/lib/hooks/useModal';
import { ContextMenuContent, ContextMenuItem } from '@/shared/ui/context-menu';
import { Copy, Edit2, Reply, Trash2 } from 'lucide-react';
import { IMessage } from '@/shared/model/types';
import { useMessage } from '../../lib/hooks/useMessage';
import { useLayoutContext } from '@/shared/lib/hooks/useLayoutContext';

const MessageContextMenu = ({ message, isMessageFromMe }: { message: IMessage; isMessageFromMe: boolean }) => {
    const { handleCopyToClipboard, handleMessageDelete, handleContextAction } = useMessage(message);
    const { openModal, closeModal } = useModal();
    const { textareaRef } = useLayoutContext();

    const confirmationConfig: ModalConfig = {
        id: 'delete-message',
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

    const contextMenu: Array<{ text: string; icon: React.ReactNode; onClick: () => void; condition: boolean }> = [
        {
            text: 'Reply',
            icon: <Reply className='w-4 h-4' />,
            condition: true,
            onClick: () => handleContextAction({ state: 'reply', value: '', selectedMessage: message })
        },
        {
            text: 'Copy',
            condition: true,
            icon: <Copy className='w-4 h-4' />,
            onClick: handleCopyToClipboard
        },
        {
            text: 'Edit',
            icon: <Edit2 className='w-4 h-4' />,
            condition: isMessageFromMe,
            onClick: () => handleContextAction({ state: 'edit', value: message.text, selectedMessage: message })
        },
        {
            text: 'Delete',
            icon: <Trash2 className='w-4 h-4 text-red-400' />,
            condition: isMessageFromMe,
            onClick: () => openModal(confirmationConfig)
        }
    ];

    return (
        <ContextMenuContent
            onCloseAutoFocus={() => textareaRef.current?.focus()}
            asChild
            loop
            className='z-[999] w-52 dark:bg-primary-dark-150 bg-primary-white border border-solid dark:border-primary-dark-200 border-primary-white rounded-md flex flex-col gap-2 p-1'
        >
            <ul>
                {contextMenu.map(({ text, icon, onClick, condition }, index) => condition && (
                    <ContextMenuItem
                        asChild
                        key={index}
                        className='flex items-center gap-5 dark:text-primary-white text-primary-dark-200 rounded-md dark:hover:bg-primary-dark-200 focus:bg-primary-gray dark:focus:bg-primary-dark-200 hover:bg-primary-gray'
                        onClick={onClick}
                    >
                        <li>
                            {icon}
                            {text}
                        </li>
                    </ContextMenuItem>
                ))}
            </ul>
        </ContextMenuContent>
    );
};

export default MessageContextMenu;
