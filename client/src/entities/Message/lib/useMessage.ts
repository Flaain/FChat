import React from 'react';
import { toast } from 'sonner';
import { Draft } from '@/shared/model/types';
import { Message } from '../model/types';
import { messageAPI } from '../api';
import { useModal } from '@/shared/lib/providers/modal';
import { useLayout } from '@/shared/model/store';
import { useChat } from '@/shared/lib/providers/chat/context';
import { useShallow } from 'zustand/shallow';

export const useMessage = (message: Message) => {
    const { params, isContextActionsBlocked } = useChat(useShallow((state) => ({
        params: state.params,
        isContextActionsBlocked: state.isContextActionsBlocked,
    })))
    
    const onAsyncActionModal = useModal((state) => state.actions.onAsyncActionModal);
    
    const handleCopyToClipboard = React.useCallback(() => {
        navigator.clipboard.writeText(message.text);
        toast.success('Message copied to clipboard', { position: 'top-center' });
    }, []);

    const handleMessageDelete = React.useCallback(async () => {
        onAsyncActionModal(() => messageAPI.delete({ 
            query: `${params.apiUrl}/delete`, 
            body: JSON.stringify({ ...params.query, messageIds: [message._id] }) 
        }), {
            closeOnError: true,
            onReject: () => {
                toast.error('Cannot delete message', { position: 'top-center' });
            }
        });
    }, [params.id, message]);

    const handleContextAction = React.useCallback((draft: Draft) => {
        if (isContextActionsBlocked) return;
        
        useLayout.setState((prevState) => {
            const newState = new Map([...prevState.drafts]);

            newState.set(params.id, draft);

            return { drafts: newState };
        })
    }, [isContextActionsBlocked]);

    return {
        handleCopyToClipboard,
        handleMessageDelete,
        handleContextAction
    };
};