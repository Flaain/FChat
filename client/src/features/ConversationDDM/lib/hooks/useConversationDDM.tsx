import React from 'react';
import Confirm from '@/widgets/Confirm/ui/ui';
import { useConversationContext } from '@/pages/Conversation/lib/hooks/useConversationContext';
import { api } from '@/shared/api';
import { AppException } from '@/shared/api/error';
import { useModal } from '@/shared/lib/hooks/useModal';

export const useConversationDDM = () => {
    const { data: { conversation: { recipient } } } = useConversationContext();
    const { openModal, closeModal, setIsAsyncActionLoading } = useModal();

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const handleUnblockRecipient = async (event: React.MouseEvent<HTMLDivElement>) => {
        try {
            event.stopPropagation();

            setIsAsyncActionLoading(true);

            await api.user.unblock({ recipientId: recipient._id });

            closeModal();
        } catch (error) {
            console.error(error);
            error instanceof AppException && error.toastError('Failed to block recipient');   
        } finally {
            setIsAsyncActionLoading(false);
        }
    }
    const handleDeleteConversation = async () => {
        try {
            setIsAsyncActionLoading(true);

            await api.conversation.delete(recipient._id);

            closeModal();
        } catch (error) {
            console.error(error);
            error instanceof AppException && error.toastError('Failed to delete conversation');
        } finally {
            setIsAsyncActionLoading(false);
        }
    };

    const onClickDeleteConversation = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        
        setIsMenuOpen(false);
        openModal({
            id: 'delete-conversation',
            content: (
                <Confirm
                    onConfirm={handleDeleteConversation}
                    onCancel={closeModal}
                    text='Are you sure you want to delete this conversation?'
                    onConfirmText='Delete'
                    onConfirmButtonVariant='destructive'
                />
            ),
            withHeader: false,
            bodyClassName: 'h-auto p-5 w-[400px]'
        });
    };

    const handleBlockRecipient = async () => {
        try {
            setIsAsyncActionLoading(true);

            await api.user.block({ recipientId: recipient._id });

            closeModal();
        } catch (error) {
            console.error(error);
            error instanceof AppException && error.toastError('Failed to block recipient');   
        } finally {
            setIsAsyncActionLoading(false);
        }
    }

    const onBlockRecipient = async (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();

        setIsMenuOpen(false);
        openModal({
            id: 'delete-conversation',
            content: (
                <Confirm
                    onConfirm={handleBlockRecipient}
                    onCancel={closeModal}
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
        isMenuOpen,
        setIsMenuOpen,
        onBlockRecipient,
        handleUnblockRecipient,
        onClickDeleteConversation
    };
};