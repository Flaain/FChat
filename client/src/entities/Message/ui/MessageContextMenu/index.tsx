import Confirmation from '@/shared/ui/Confirmation';
import { ModalConfig } from '@/shared/lib/contexts/modal/types';
import { useModal } from '@/shared/lib/hooks/useModal';
import { ContextMenuContent, ContextMenuItem } from '@/shared/ui/context-menu';
import { Copy, Edit2, Trash2 } from 'lucide-react';
import { IMessage } from '@/shared/model/types';
import { useMessage } from '../../lib/hooks/useMessage';

const contextMenuStyles = 'flex items-center justify-between gap-2 dark:text-primary-white text-primary-dark-200 rounded-md dark:hover:bg-primary-dark-200 focus:bg-primary-gray dark:focus:bg-primary-dark-200 hover:bg-primary-gray';

const MessageContextMenu = ({ message, isMessageFromMe }: { message: IMessage; isMessageFromMe: boolean }) => {
    const { handleCopyToClipboard, handleMessageDelete, handleMessageEdit } = useMessage(message);
    const { openModal, closeModal, onAsyncActionCall } = useModal();

    const confirmationConfig: ModalConfig = {
        content: (
            <Confirmation
                onCancel={closeModal}
                onConfirm={() =>
                    onAsyncActionCall({ asyncAction: handleMessageDelete, errorMessage: 'Cannot delete message' })
                }
                onConfirmText='Delete'
                text='Are you sure you want to delete this message?'
            />
        ),
        title: 'Delete message',
        size: 'fit'
    };

    const contextMenu = [
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
            onClick: handleMessageEdit
        },
        {
            text: 'Delete',
            icon: <Trash2 className='w-4 h-4' />,
            condition: isMessageFromMe,
            onClick: () => openModal(confirmationConfig)
        }
    ];

    return (
        <ContextMenuContent className='w-52 dark:bg-primary-dark-150 bg-primary-white border border-solid dark:border-primary-dark-200 border-primary-white rounded-md flex flex-col gap-2 p-1'>
            {contextMenu.map(({ text, icon, onClick, condition }, index) =>
                condition ? (
                    <ContextMenuItem key={index} className={contextMenuStyles} onClick={onClick}>
                        {text}
                        {icon}
                    </ContextMenuItem>
                ) : null
            )}
        </ContextMenuContent>
    );
};

export default MessageContextMenu;