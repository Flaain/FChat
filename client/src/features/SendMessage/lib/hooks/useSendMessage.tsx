import React from 'react';
import Confirm from '@/widgets/Confirm/ui/ui';
import { toast } from 'sonner';
import { api } from '@/shared/api';
import { useModal } from '@/shared/lib/hooks/useModal';
import { useLayoutContext } from '@/shared/lib/hooks/useLayoutContext';
import { APIData, EmojiData, IMessage, MessageFormState } from '@/shared/model/types';
import { UseMessageParams } from '../../model/types';

export const useSendMessage = ({ type, queryId, onChange }: UseMessageParams) => {
    const { openModal, closeModal, setIsAsyncActionLoading } = useModal();
    const { drafts, setDrafts, textareaRef } = useLayoutContext();

    const [isLoading, setIsLoading] = React.useState(false);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = React.useState(false);
    const [value, setValue] = React.useState(drafts.get(queryId!)?.value ?? '');

    const currentDraft = drafts.get(queryId);

    const onEmojiSelect = React.useCallback(({ native }: EmojiData) => {
        setValue((prev) => prev + native);
        textareaRef.current?.focus();
    }, []);

    React.useEffect(() => { textareaRef.current?.focus() }, [])
    React.useEffect(() => { setValue(currentDraft?.value ?? '') }, [currentDraft]);

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
        
        onChange?.(trimmedValue);
        setValue(!trimmedValue.length ? '' : value.normalize('NFC').replace(/[\u0300-\u036f]/g, ""));
    }, [onChange]);

    const setDefaultState = React.useCallback(() => {
        setDrafts((prevState) => {
            const newState = new Map([...prevState]);

            newState.delete(queryId);

            return newState;
        });

        setValue('');

        textareaRef.current?.focus();
    }, []);

    const handleDeleteConversationMessage = React.useCallback(async () => {
        try {
            setIsAsyncActionLoading(true);
            
            await api.message.delete({ messageId: currentDraft?.selectedMessage?._id!, recipientId: queryId });

            toast.success('Message deleted', { position: 'top-center' });
        } catch (error) {
            console.error(error);
            textareaRef.current?.focus();
            toast.error('Cannot delete message', { position: 'top-center' }) 
        } finally {
            closeModal();
            setIsAsyncActionLoading(false);
        }
    }, [currentDraft, queryId]);
    
    const onBlur = React.useCallback(({ target: { value } }: React.FocusEvent<HTMLTextAreaElement, Element>) => {
        const trimmedValue = value.trim();

        if ((!trimmedValue.length && !currentDraft) || trimmedValue === currentDraft?.value) return;

        setDrafts((prevState) => {
            const newState = new Map([...prevState]);
            const currentDraft = newState.get(queryId);
            const isEmpty = !trimmedValue.length && currentDraft?.state === 'send';

            isEmpty ? newState.delete(queryId) : newState.set(queryId, currentDraft ? { ...currentDraft, value: trimmedValue } : { 
                state: 'send', 
                value: trimmedValue 
            });

            return newState;
        });
    }, [queryId, currentDraft]);

    const onSendEditedMessage = async () => {
        try {
            const trimmedValue = value.trim();

            if (!trimmedValue.length)
                return openModal({
                    content: (
                        <Confirm
                            onCancel={closeModal}
                            onConfirm={handleDeleteConversationMessage}
                            onConfirmText='Delete'
                            text='Are you sure you want to delete this message?'
                            onConfirmButtonVariant='destructive'
                        />
                    ),
                    withHeader: false,
                    bodyClassName: 'h-auto p-5 w-[400px]'
                });

            if (trimmedValue === currentDraft!.selectedMessage!.text) return;

            const actions: Record<typeof type, (params: { messageId: string; message: string }) => Promise<APIData<IMessage>>> = {
                conversation: ({ messageId, message }) => api.message.edit({ messageId, message, recipientId: queryId }),
                group: async () => {}
            };

            await actions[type]({ messageId: currentDraft!.selectedMessage!._id, message: trimmedValue });
        } catch (error) {
            console.error(error);
            toast.error('Cannot edit message', { position: 'top-center' });
        }
    };

    const onSendConversationMessage = React.useCallback(async (message: string) => {
        await api.message.send({ message, recipientId: queryId });
    }, [queryId]);

    const onSendGroupMessage = React.useCallback(async (message: string) => {
        toast.info('Not implemented', { position: 'top-center', description: message });
    }, []);

    const onSendMessage = async () => {
        try {
            const trimmedValue = value.trim();

            if (!trimmedValue.length) return;

            const actions: Record<typeof type, (message: string) => Promise<void>> = {
                conversation: onSendConversationMessage,
                group: onSendGroupMessage
            };

            await actions[type](trimmedValue);
        } catch (error) {
            console.error(error);
            toast.error('Cannot send message', { position: 'top-center' });
        }
    };

    const onReplyMessage = async () => {
        try {
            const trimmedValue = value.trim();

            if (!trimmedValue.length) return;

            const actions: Record<typeof type, (message: string) => Promise<void | APIData<IMessage>>> = {
                conversation: (message: string) => api.message.reply({ 
                    message, 
                    messageId: currentDraft!.selectedMessage!._id, 
                    recipientId: queryId
                }),
                group: async (message: string) => {}
            };

            await actions[type](trimmedValue);
        } catch (error) {
            console.error(error);
            toast.error('Cannot reply message', { position: 'top-center' });
        }
    } 

    const handleSubmitMessage = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault();

            setIsLoading(true);

            const actions: Record<MessageFormState, () => Promise<void>> = {
                send: onSendMessage,
                edit: onSendEditedMessage,
                reply: onReplyMessage
            };

            await actions[currentDraft?.state ?? 'send']();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
            setTimeout(() => textareaRef.current?.focus(), 0); // kludge, .focus() doesn't work cuz of disabled textarea on loading
        }
    };

    return {
        isLoading,
        value,
        isEmojiPickerOpen,
        setIsEmojiPickerOpen,
        onKeyDown,
        onBlur,
        setDefaultState,
        handleSubmitMessage,
        handleChange,
        onEmojiSelect
    };
};