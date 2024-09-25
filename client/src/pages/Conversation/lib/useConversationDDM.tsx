import { useModal } from '@/shared/lib/providers/modal';
import { Confirm } from '@/shared/ui/Confirm';
import { toast } from 'sonner';
import { conversationAPI } from '../api';
import { profileAPI } from '@/entities/profile';
import { useConversation } from '../model/context';

export const useConversationDDM = () => {
    const { onAsyncActionModal, onCloseModal, onOpenModal } = useModal();
    const { data: { conversation: { recipient } } } = useConversation();

    const handleBlockRecipient = async (type: 'block' | 'unblock', event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();

        onOpenModal({
            content: (
                <Confirm
                    onConfirm={() => onAsyncActionModal(() => profileAPI[type]({ recipientId: recipient._id }), {
                        closeOnError: true,
                        onReject: () => {
                            toast.error(`Failed to ${type} user`);
                        }
                    })}
                    onCancel={onCloseModal}
                    text={`Are you sure you want to ${type} ${recipient.name}?`}
                    onConfirmText={type}
                    onConfirmButtonVariant={type === 'block' ? 'destructive' : 'default'}
                />
            ),
            withHeader: false,
            bodyClassName: 'h-auto p-5 w-fit'
        });        
    }

    const handleDeleteConversation = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();

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
            bodyClassName: 'h-auto p-5 w-fit'
        });   
    };

    return {
        handleBlockRecipient,
        handleDeleteConversation,
    };
};