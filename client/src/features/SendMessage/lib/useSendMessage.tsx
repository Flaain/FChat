import React from 'react';
import { toast } from 'sonner';
import { MessageFormState } from '@/shared/model/types';
import { EmojiData, UseMessageParams } from '../model/types';
import { useModal } from '@/shared/lib/providers/modal';
import { useLayout } from '@/shared/lib/providers/layout/context';
import { Confirm } from '@/shared/ui/Confirm';
import { messageAPI } from '@/entities/Message/api';

export const useSendMessage = ({ params, onChange }: UseMessageParams) => {
    const { onCloseModal, onOpenModal, onAsyncActionModal } = useModal();
    const { drafts, setDrafts, textareaRef } = useLayout();

    const currentDraft = drafts.get(params.id);

    const [isLoading, setIsLoading] = React.useState(false);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = React.useState(false);
    const [value, setValue] = React.useState(currentDraft?.value ?? '');

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

            newState.delete(params.id);

            return newState;
        });

        setValue('');

        textareaRef.current?.focus();
    }, []);

    const handleDeleteMessage = React.useCallback(async () => {
        onAsyncActionModal(() => messageAPI.delete({ 
            query: `${params.apiUrl}/delete/${currentDraft?.selectedMessage?._id!}`, 
            body: JSON.stringify(params.query) 
        }), {
            closeOnError: true,
            onResolve: () => {
                toast.success('Message deleted', { position: 'top-center' });
                setDefaultState();
            },
            onReject: () => {
                toast.error('Cannot delete message', { position: 'top-center' });
                textareaRef.current?.focus();
            }
        })
    }, [currentDraft, params.id]);
    
    const onBlur = React.useCallback(({ target: { value } }: React.FocusEvent<HTMLTextAreaElement, Element>) => {
        const trimmedValue = value.trim();

        if ((!trimmedValue.length && !currentDraft) || trimmedValue === currentDraft?.value) return;

        setDrafts((prevState) => {
            const newState = new Map([...prevState]);
            const isEmpty = !trimmedValue.length && currentDraft?.state === 'send';

            isEmpty ? newState.delete(params.id) : newState.set(params.id, currentDraft ? { ...currentDraft, value: trimmedValue } : { 
                state: 'send', 
                value: trimmedValue 
            });

            return newState;
        });
    }, [params.id, currentDraft]);

    const onSendEditedMessage = async (message: string) => {
        try {
            if (!message.length)
                return onOpenModal({
                    content: (
                        <Confirm
                            onCancel={onCloseModal}
                            onConfirm={handleDeleteMessage}
                            onConfirmText='Delete'
                            text='Are you sure you want to delete this message?'
                            onConfirmButtonVariant='destructive'
                        />
                    ),
                    withHeader: false,
                    bodyClassName: 'h-auto p-5 w-[400px]'
                });

            if (message === currentDraft!.selectedMessage!.text) return;

            await messageAPI.edit({ 
                query: `${params.apiUrl}/edit/${currentDraft!.selectedMessage!._id}`,
                body: JSON.stringify({ message, ...params.query })
             })
        } catch (error) {
            console.error(error);
            toast.error('Cannot edit message', { position: 'top-center' });
        }
    };

    const onSendMessage = async (message: string) => {
        try {
            if (!message.length) return;

            await messageAPI.send({ query: `${params.apiUrl}/send/${params.id}`, body: JSON.stringify({ message }) })
        } catch (error) {
            console.error(error);
            toast.error('Cannot send message', { position: 'top-center' });
        }
    };

    const onReplyMessage = async (message: string) => {
        try {
            if (!message.length) return;

            await messageAPI.reply({ 
                query: `${params.apiUrl}/reply/${currentDraft!.selectedMessage!._id}`,
                body: JSON.stringify({ message, ...params.query })
             })
        } catch (error) {
            console.error(error);
            toast.error('Cannot reply message', { position: 'top-center' });
        }
    } 

    const handleSubmitMessage = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault();

            setIsLoading(true);

            const actions: Record<MessageFormState, (message: string) => Promise<void>> = {
                send: onSendMessage,
                edit: onSendEditedMessage,
                reply: onReplyMessage
            };

            await actions[currentDraft?.state ?? 'send'](value.trim());
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