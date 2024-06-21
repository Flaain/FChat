import React from 'react';
import { Emoji } from '@emoji-mart/data';
import { useConversationContext } from '@/pages/Conversation/lib/hooks/useConversationContext';

export const useEmojiPicker = (textareaRef: React.MutableRefObject<HTMLTextAreaElement | null>) => {
    const { data, setValue } = useConversationContext()

    const [isOpen, setIsOpen] = React.useState(false);

    const onEmojiSelect = React.useCallback((emoji: Emoji) => {
        setValue((prev) => prev + emoji.native);
        textareaRef.current?.focus();
    }, [data]);

    const openEmojiPicker = React.useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        setIsOpen((prevState) => !prevState);
    }, [setIsOpen]);

    const onClickOutside = React.useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen]);

    return { isOpen, onEmojiSelect, onClickOutside, openEmojiPicker };
};