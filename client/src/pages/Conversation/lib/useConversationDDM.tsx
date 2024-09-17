import { api } from '@/shared/api';
import { useModal } from '@/shared/lib/providers/modal';
import { Confirm } from '@/shared/ui/Confirm';
import { toast } from 'sonner';
import { conversationAPI } from '../api';
import { useConversationStore } from '../model/store';

export const useConversationDDM = () => {
    const { conversation: { recipient } } = useConversationStore((state) => state.data);
    const { onAsyncActionModal, onCloseModal, onOpenModal } = useModal((state) => ({
        onAsyncActionModal: state.onAsyncActionModal,
        onCloseModal: state.onCloseModal,
        onOpenModal: state.onOpenModal
    }));

    const handleUnblockRecipient = async () => {
        onOpenModal({
            content: (
                <Confirm
                    onConfirm={() => onAsyncActionModal(() => api.user.unblock({ recipientId: recipient._id }), {
                        onReject: () => {
                            toast.error('Failed to unblock user');
                        }
                    })}
                    onCancel={onCloseModal}
                    text={`Are you sure you want to unblock ${recipient.name}?`}
                    onConfirmText='Block'
                    onConfirmButtonVariant='destructive'
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
                        onReject: () => {
                            toast.error('Failed to delete conversation');
                        }
                    })}
                    onCancel={onCloseModal}
                    text={`Are you sure you want to delete conversation with ${recipient.name}?`}
                    onConfirmText='Block'
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
                    onConfirm={() => onAsyncActionModal(() => api.user.block({ recipientId: recipient._id }), {
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