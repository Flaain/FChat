import React from 'react';
import Confirmation from '@/shared/ui/Confirmation';
import { toast } from 'sonner';
import { api } from '@/shared/api';
import { useSession } from '@/entities/session/lib/hooks/useSession';
import { useConversationContext } from '@/pages/Conversation/lib/hooks/useConversationContext';
import { useModal } from '@/shared/lib/hooks/useModal';
import { useLayoutContext } from '@/shared/lib/hooks/useLayoutContext';
import { ConversationFeed, FeedTypes, MessageFormState } from '@/shared/model/types';

export const useSendMessage = () => {
    const { state: { accessToken } } = useSession();
    const { openModal, closeModal, setIsAsyncActionLoading } = useModal();
    const { setConversation, scrollTriggeredFromRef, data: conversation } = useConversationContext();
    const { conversationDrafts, setLocalResults, setConversationDrafts } = useLayoutContext();

    const [isLoading, setIsLoading] = React.useState(false);

    const onKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey && 'form' in event.target) {
            event.preventDefault();
            (event.target.form as HTMLFormElement).requestSubmit();
        }
    }, []);

    const handleChange = React.useCallback(({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
        setConversationDrafts((prevState) => {
            const newState = new Map([...prevState]);
            const currentState = newState.get(conversation?.conversation.recipient._id) ?? { value: '', state: 'send', selectedMessage: null };

            newState.set(conversation?.conversation.recipient._id, { ...currentState, value });

            return newState;
        })
    }, []);

    const handleCloseEdit = React.useCallback(() => {
        setConversationDrafts((prevState) => {
            const newState = new Map([...prevState]);

            newState.set(conversation?.conversation.recipient._id, { value: '', state: 'send', selectedMessage: null });

            return newState;
        })
    }, []);

    const handleMessageDelete = React.useCallback(async () => {
        try {
            setIsAsyncActionLoading(true);

            await api.message.delete({
                body: { 
                    conversationId: conversation?.conversation._id, 
                    messageId: conversationDrafts.get(conversation?.conversation.recipient._id)!.selectedMessage!._id 
                },
                token: accessToken!
            });

            setConversation((prev) => ({
                ...prev,
                conversation: {
                    ...prev.conversation,
                    messages: prev.conversation.messages.filter((message) => message._id !== conversationDrafts.get(conversation?.conversation.recipient._id)!.selectedMessage!._id)
                }
            }));

            toast.success('Message deleted', { position: 'top-center' });
        } catch (error) {
            console.error(error);
            error instanceof Error && toast.error(error.message, { position: 'top-center' });
        } finally {
            handleCloseEdit();
            setIsAsyncActionLoading(false);
        }
    }, [conversationDrafts, accessToken, setConversation, handleCloseEdit]);

    const onCloseDeleteConfirmation = () => {
        setConversationDrafts((prevState) => {
            const newState = new Map([...prevState]);
            const current = newState.get(conversation?.conversation.recipient._id)!;

            newState.set(conversation?.conversation.recipient._id, { ...current, value: current.selectedMessage!.text });

            return newState;
        })
        closeModal();
    };

    const onSendEditedMessage = async () => {
        const { selectedMessage, value } = conversationDrafts.get(conversation?.conversation.recipient._id)!;
        const trimmedValue = value.trim();

        if (!trimmedValue.length)
            return openModal({
                content: (
                    <Confirmation
                        onCancel={onCloseDeleteConfirmation}
                        onConfirm={handleMessageDelete}
                        onConfirmText='Delete'
                        text='Are you sure you want to delete this message?'
                    />
                ),
                title: 'Delete message',
                size: 'fit'
            });

        if (trimmedValue === selectedMessage!.text) return handleCloseEdit();

        const { data } = await api.message.edit({
            body: { messageId: selectedMessage!._id, message: trimmedValue },
            token: accessToken!
        });

        setConversation((prevState) => ({
            ...prevState,
            conversation: {
                ...prevState.conversation,
                messages: prevState.conversation.messages.map((message) => message._id === selectedMessage!._id ? data : message)
            }
        }));

        handleCloseEdit();
    };

    const onSendMessage = async () => {
        const { value } = conversationDrafts.get(conversation?.conversation.recipient._id)!;
        const trimmedValue = value.trim();

        if (!trimmedValue.length) return;

        try {
            if (!conversation?.conversation?._id) {
                const { data } = await api.conversation.create({
                    body: { recipientId: conversation?.conversation.recipient._id },
                    token: accessToken!
                });
    
                const feedConversation: ConversationFeed = {
                    _id: data._id,
                    lastMessageSentAt: data.lastMessageSentAt,
                    participants: [conversation?.conversation.recipient],
                    type: FeedTypes.CONVERSATION
                };
    
                setConversation((prevState) => ({ ...prevState, conversation: { ...prevState.conversation, ...data } }));
                setLocalResults((prevState) => [feedConversation, ...prevState]);
            }
    
            const { data } = await api.message.send({
                token: accessToken!,
                body: { message: trimmedValue, recipientId: conversation?.conversation.recipient._id }
            });
    
            setConversationDrafts((prevState) => {
                const newState = new Map([...prevState]);
    
                newState.set(conversation?.conversation.recipient._id, { value: '', selectedMessage: null, state: 'send' });
    
                return newState;
            });
    
            setConversation((prev) => ({ ...prev, conversation: { ...prev.conversation, messages: [...prev.conversation.messages, data] } }));
            setLocalResults((prevState) =>
                prevState
                    .map((item) => item._id === data.conversationId ? ({ ...item, lastMessage: data, lastMessageSentAt: data.createdAt } as ConversationFeed) : item)
                    .sort((a, b) => new Date(b.lastMessageSentAt).getTime() - new Date(a.lastMessageSentAt).getTime())
            );
        } catch (error) {
            console.error(error);
            toast.error('Cannot send message', { position: 'top-center' });
        }
    };

    const handleSubmitMessage = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isLoading) return;

        try {
            setIsLoading(true);

            scrollTriggeredFromRef.current = 'send';

            const actions: Record<MessageFormState, () => Promise<void>> = {
                send: onSendMessage,
                edit: onSendEditedMessage
            };

            await actions[conversationDrafts.get(conversation?.conversation.recipient._id)!.state]();
        } catch (error) {
            console.error(error);
            error instanceof Error && toast.error(error.message, { position: 'top-center' });
        } finally {
            setIsLoading(false);
        }
    };

    return {
        value: conversationDrafts.get(conversation?.conversation.recipient._id)?.value ?? '',
        selectedMessage: conversationDrafts.get(conversation?.conversation.recipient._id)?.selectedMessage ?? null,
        formState: conversationDrafts.get(conversation?.conversation.recipient._id)?.state ?? 'send',
        isLoading,
        onKeyDown,
        handleCloseEdit,
        handleSubmitMessage,
        handleChange
    };
};