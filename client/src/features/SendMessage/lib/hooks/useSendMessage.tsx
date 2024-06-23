import React from 'react';
import Confirmation from '@/shared/ui/Confirmation';
import { toast } from 'sonner';
import { api } from '@/shared/api';
import { useSession } from '@/entities/session/lib/hooks/useSession';
import { useConversationContext } from '@/pages/Conversation/lib/hooks/useConversationContext';
import { useModal } from '@/shared/lib/hooks/useModal';
import { useLayoutContext } from '@/shared/lib/hooks/useLayoutContext';
import { ConversationFeed, FeedTypes, MessageFormState } from '@/shared/model/types';
import { UseMessageParams } from '../../model/types';
import { Emoji } from '@emoji-mart/data';

export const useSendMessage = ({ type, queryId }: UseMessageParams) => {
    const { state: { accessToken } } = useSession();
    const { openModal, closeModal, setIsAsyncActionLoading } = useModal();
    const { setConversation, scrollTriggeredFromRef, data: conversation } = useConversationContext();
    const { drafts, setLocalResults, setDrafts } = useLayoutContext();

    const [isLoading, setIsLoading] = React.useState(false);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = React.useState(false);
    const [value, setValue] = React.useState(drafts.get(queryId!)?.value ?? '');

    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const currentDraft = drafts.get(queryId);

    const onEmojiSelect = React.useCallback(({ native }: Emoji) => {
        setValue((prev) => prev + native);
        textareaRef.current?.focus();
    }, []);

    React.useEffect(() => {
        setValue(drafts.get(queryId!)?.value ?? '');
    }, [drafts])

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

    const getDefaultState = React.useCallback(() => {
        setDrafts((prevState) => {
            const newState = new Map([...prevState]);

            newState.delete(queryId)

            return newState;
        })

        setValue('');
    }, []);

    const handleDeleteConversationMessage = React.useCallback(async () => {
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
            getDefaultState();
            setIsAsyncActionLoading(false);
        }
    }, [drafts, accessToken, setConversation]);

    const onCloseDeleteConfirmation = () => {
        setValue(currentDraft!.selectedMessage!.text);
        closeModal();
    };

    const onBlur = React.useCallback(({ target: { value } }: React.FocusEvent<HTMLTextAreaElement, Element>) => {
        const trimmedValue = value.trim();
        
        if (!trimmedValue.length && !currentDraft || trimmedValue === currentDraft?.value) return;

        setDrafts((prevState) => {
            const newState = new Map([...prevState]);
            const currentDraft = newState.get(queryId);
            const isEmpty = !trimmedValue.length && currentDraft?.state === "send"
            
            isEmpty ? newState.delete(queryId) : newState.set(queryId, currentDraft ? { ...currentDraft, value: trimmedValue } : { state: 'send', value: trimmedValue });

            return newState;
        })
    }, [queryId]);
    
    const onSendEditedConversationMessage = React.useCallback(async ({ messageId, message }: { messageId: string, message: string }) => {
        const { data } = await api.message.edit({ body: { messageId, message }, token: accessToken! });

        setConversation((prevState) => ({
            ...prevState,
            conversation: {
                ...prevState.conversation,
                messages: prevState.conversation.messages.map((message) => message._id === messageId ? data : message)
            }
        }));
    }, [])

    const onSendEditedMessage = async () => {
        const trimmedValue = value.trim();

        if (!trimmedValue.length) return openModal({
            content: (
                <Confirmation
                    onCancel={onCloseDeleteConfirmation}
                    onConfirm={handleDeleteConversationMessage}
                    onConfirmText='Delete'
                    text='Are you sure you want to delete this message?'
                />
            ),
            title: 'Delete message',
            size: 'fit'
        });

        if (trimmedValue === currentDraft!.selectedMessage!.text) return;

        const actions: Record<typeof type, (params: { messageId: string, message: string }) => Promise<void>> = {
            conversation: onSendEditedConversationMessage,
            group: async () => {}
        }

        await actions[type]({ messageId: currentDraft!.selectedMessage!._id, message: trimmedValue });
    };

    const onSendConversationMessage = React.useCallback(async (message: string) => {
        if (!conversation?.conversation?._id) {
            const { data } = await api.conversation.create({
                body: { recipientId: queryId },
                token: accessToken!
            });

            setConversation((prevState) => ({ ...prevState, conversation: { ...prevState.conversation, ...data } }));
            setLocalResults((prevState) => [{ _id: data._id, lastMessageSentAt: data.lastMessageSentAt, participants: [conversation?.conversation.recipient], type: FeedTypes.CONVERSATION }, ...prevState]);
        }

        const { data } = await api.message.send({ 
            token: accessToken!, 
            body: { message: message, recipientId: queryId } 
        });

        setConversation((prev) => ({ ...prev, conversation: { ...prev.conversation, messages: [...prev.conversation.messages, data] } }));
        setLocalResults((prevState) =>
            prevState
                .map((item) => item._id === data.conversationId ? ({ ...item, lastMessage: data, lastMessageSentAt: data.createdAt } as ConversationFeed) : item)
                .sort((a, b) => new Date(b.lastMessageSentAt).getTime() - new Date(a.lastMessageSentAt).getTime())
        );
    }, [])

    const onSendGroupMessage = React.useCallback(async (message: string) => {
        toast.info('Not implemented', { position: 'top-center', description: message });
    }, [])

    const onSendMessage = async () => {
        try {
            const trimmedValue = value.trim();

            const actions: Record<typeof type, (message: string) => Promise<void>> = {
                conversation: onSendConversationMessage,
                group: onSendGroupMessage
            }

            await actions[type](trimmedValue);
        } catch (error) {
            console.error(error);
            toast.error('Cannot send message', { position: 'top-center' });
        }
    };

    const handleSubmitMessage = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (!value.trim().length) return;
        
        try {
            setIsLoading(true);
            
            const actions: Record<MessageFormState, () => Promise<void>> = {
                send: onSendMessage,
                edit: onSendEditedMessage
            };
            
            await actions[currentDraft?.state ?? 'send']();
            
            getDefaultState();
            scrollTriggeredFromRef.current = 'send';
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
        value,
        isEmojiPickerOpen,
        setIsEmojiPickerOpen,
        onKeyDown,
        onBlur,
        getDefaultState,
        handleSubmitMessage,
        handleChange,
        onEmojiSelect,
    };
};