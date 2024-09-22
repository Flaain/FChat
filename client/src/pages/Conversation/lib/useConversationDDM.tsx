import { useModal } from '@/shared/lib/providers/modal';
import { Confirm } from '@/shared/ui/Confirm';
import { toast } from 'sonner';
import { conversationAPI } from '../api';
import { profileAPI } from '@/entities/profile';
import { useConversation } from '../model/context';

export const useConversationDDM = () => {
    const { onAsyncActionModal, onCloseModal, onOpenModal } = useModal();
    const { data: { conversation: { recipient } } } = useConversation();

    const handleUnblockRecipient = async () => {
        onOpenModal({
            content: (
                <Confirm
                    onConfirm={() => onAsyncActionModal(() => profileAPI.unblock({ recipientId: recipient._id }), {
                        closeOnError: true,
                        onReject: () => {
                            toast.error('Failed to unblock user');
                        }
                    })}
                    onCancel={onCloseModal}
                    text={`Are you sure you want to unblock ${recipient.name}?`}
                    onConfirmText='Unblock'
                />
            ),
            withHeader: false,
            bodyClassName: 'h-auto p-5 w-[400px]'
        });        
    }
    const handleDeleteConversation = async () => {
        onOpenModal({
            content: (
                <Confirm
                    onConfirm={() => onAsyncActionModal(() => conversationAPI.delete(recipient._id), {
                        closeOnError: true,
                        onReject: () => {
                            toast.error('Failed to delete conversation');
                        }
                    })}
                    onCancel={onCloseModal}
                    text={`Are you sure you want to delete conversation with ${recipient.name}?`}
                    onConfirmText='Delete'
                    onConfirmButtonVariant='destructive'
                />
            ),
            withHeader: false,
            bodyClassName: 'h-auto p-5 w-[400px]'
        });   
    };

    const handleBlockRecipient = async () => {
        onOpenModal({
            content: (
                <Confirm
                    onConfirm={() => onAsyncActionModal(() => profileAPI.block({ recipientId: recipient._id }), {
                        closeOnError: true,
                        onReject: () => {
                            toast.error('Failed to block user');
                        }
                    })}
                    onCancel={onCloseModal}
                    text={`Are you sure you want to block ${recipient.name}?`}
                    onConfirmText='Block'
                    onConfirmButtonVariant='destructive'
                />
            ),
            withHeader: false,
            bodyClassName: 'h-auto p-5 w-[400px]'
        });  
    }

    return {
        handleBlockRecipient,
        handleDeleteConversation,
        handleUnblockRecipient,
    };
};