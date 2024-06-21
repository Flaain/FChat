import React from 'react';
import Confirmation from '@/shared/ui/Confirmation';
import { toast } from 'sonner';
import { api } from '@/shared/api';
import { useSession } from '@/entities/session/lib/hooks/useSession';
import { useConversationContext } from '@/pages/Conversation/lib/hooks/useConversationContext';
import { useModal } from '@/shared/lib/hooks/useModal';
import { useLayoutContext } from '@/shared/lib/hooks/useLayoutContext';
import { ConversationFeed, FeedTypes, MessageFormState } from '@/shared/model/types';

export const useSendMessage = ({ type, queryId }: { type: 'conversation' | 'group', queryId: string }) => {
    const { state: { accessToken } } = useSession();
    const { openModal, closeModal, setIsAsyncActionLoading } = useModal();
    const { setConversation, value, setValue, scrollTriggeredFromRef, data: conversation } = useConversationContext();
    const { drafts, setLocalResults, setDrafts } = useLayoutContext();

    const [isLoading, setIsLoading] = React.useState(false);

    const currentDraft = drafts.get(queryId);
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    
    React.useEffect(() => {
        if (!textareaRef.current) return;

        textareaRef.current.style.height = 'inherit';
        textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 50)}px`;
    }, [value]);

    const onKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey && 'form' in event.target) {
            event.preventDefault();
            (event.target.form as HTMLFormElement).requestSubmit();
        }
    }, []);

    const handleChange = React.useCallback(({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
        const trimmedValue = value.trim();

        setValue(!trimmedValue.length ? '' : value);
    }, []);

    const handleCloseEdit = React.useCallback(() => {
        setDrafts((prevState) => {
            const newState = new Map([...prevState]);

            newState.delete(queryId)

            return newState;
        })

        setValue('');
    }, []);

    const handleMessageDelete = React.useCallback(async () => {
        try {
            setIsAsyncActionLoading(true);

            await api.message.delete({
                body: { 
                    conversationId: queryId, 
                    messageId: drafts.get(queryId)!.selectedMessage!._id 
                },
                token: accessToken!
            });

            setConversation((prev) => ({
                ...prev,
                conversation: {
                    ...prev.conversation,
                    messages: prev.conversation.messages.filter((message) => message._id !== currentDraft?.selectedMessage?._id)
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
    }, [drafts, accessToken, setConversation, handleCloseEdit]);

    const onCloseDeleteConfirmation = () => {
        setValue(currentDraft!.selectedMessage!.text);
        closeModal();
    };

    const onBlur = ({ target: { value } }: React.FocusEvent<HTMLTextAreaElement, Element>) => {
        const trimmedValue = value.trim();
        
        if (!trimmedValue.length && !currentDraft) return;
        
        setDrafts((prevState) => {
            const newState = new Map([...prevState]);
            const isEmpty = !trimmedValue.length && currentDraft?.state === "send"
            
            isEmpty ? newState.delete(queryId) : newState.set(queryId, currentDraft ? { ...currentDraft, value: trimmedValue } : {
                state: 'send',
                selectedMessage: null,
                value: trimmedValue,
            });

            return newState;
        })
    }

    const onSendEditedMessage = async () => {
        const { selectedMessage } = drafts.get(queryId)!;
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

        if (trimmedValue === selectedMessage!.text) return;

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
    };

    const onSendMessage = async () => {
        const { value } = drafts.get(queryId)!;
        const trimmedValue = value.trim();

        if (!trimmedValue.length) return;

        try {
            if (!conversation?.conversation?._id) {
                const { data } = await api.conversation.create({
                    body: { recipientId: queryId },
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
                body: { message: trimmedValue, recipientId: queryId }
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

            await actions[drafts.get(queryId)!.state]();
        
            setDrafts((prevState) => {
                const newState = new Map([...prevState]);
    
                newState.delete(queryId);
    
                return newState;
            });
            setValue('');
        } catch (error) {
            console.error(error);
            error instanceof Error && toast.error(error.message, { position: 'top-center' });
        } finally {
            setIsLoading(false);
            setTimeout(() => textareaRef.current?.focus(), 0); // kludge, .focus() doesn't work cuz of disabled textarea on loading
        }
    };

    return {
        isLoading,
        textareaRef,
        onKeyDown,
        onBlur,
        handleCloseEdit,
        handleSubmitMessage,
        handleChange
    };
};