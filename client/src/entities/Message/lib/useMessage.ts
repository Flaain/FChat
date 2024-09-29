import React from 'react';
import { toast } from 'sonner';
import { Draft } from '@/shared/model/types';
import { useModal } from '@/shared/lib/providers/modal';
import { Message } from '../model/types';
import { useLayout } from '@/shared/lib/providers/layout/context';
import { messageAPI } from '../api';
import { useMessagesList } from '@/widgets/MessagesList/model/context';

export const useMessage = (message: Message) => {
    const { setDrafts } = useLayout();
    const { onAsyncActionModal } = useModal();
    const { isContextActionsBlocked, params } = useMessagesList();

    const handleCopyToClipboard = React.useCallback(() => {
        navigator.clipboard.writeText(message.text);
        toast.success('Message copied to clipboard', { position: 'top-center' });
    }, []);

    const handleMessageDelete = React.useCallback(async () => {
        onAsyncActionModal(() => messageAPI.delete({ 
            query: `${params.apiUrl}/delete`, 
            body: JSON.stringify({ ...params.query, messageIds: [message._id] }) 
        }), {
            onReject: () => {
                toast.error('Cannot delete message', { position: 'top-center' });
            }
        });
    }, [params.id, message]);

    const handleContextAction = React.useCallback((draft: Draft) => {
        if (isContextActionsBlocked) return;
        
        setDrafts((prevState) => {
            const newState = new Map([...prevState]);

            newState.set(params.id, draft);

            return newState;
        })
    }, [isContextActionsBlocked]);

    return {
        handleCopyToClipboard,
        handleMessageDelete,
        handleContextAction
    };
};