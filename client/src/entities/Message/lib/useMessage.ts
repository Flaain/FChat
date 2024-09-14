import React from 'react';
import { toast } from 'sonner';
import { Draft } from '@/shared/model/types';
import { useLayout } from '@/shared/model/store';
import { useModal } from '@/shared/lib/providers/modal';
import { messageApi } from '../api';
import { Message } from '../model/types';
import { useParams } from 'react-router-dom';
import { useMessageStore } from '../model/store';

const apiQueries: Record<'User' | 'Participant', string> = {
    User: 'message',
    Participant: 'message/group'
}

export const useMessage = (message: Message) => {
    const { id } = useParams() as { id: string };
    const { setDrafts } = useLayout();
    const { onAsyncActionModal } = useModal();
    const { isContextActionsDisabled } = useMessageStore();

    const handleCopyToClipboard = React.useCallback(() => {
        navigator.clipboard.writeText(message.text);
        toast.success('Message copied to clipboard', { position: 'top-center' });
    }, []);

    const handleMessageDelete = React.useCallback(async () => {
        await onAsyncActionModal(() => messageApi.delete({ query: `${apiQueries[message.refPath]}/delete/${message._id}`, body: JSON.stringify({ id }) }), {
            onReject: () => {
                toast.error('Cannot delete message', { position: 'top-center' });
            }
        });
    }, [id, message]);

    const handleContextAction = React.useCallback((draft: Draft) => {
        if (isContextActionsDisabled) return;
        
        setDrafts((prevState) => {
            const newState = new Map([...prevState]);

            newState.set(id, draft);

            return newState;
        })
    }, [isContextActionsDisabled]);

    return {
        handleCopyToClipboard,
        handleMessageDelete,
        handleContextAction
    };
};