import React from 'react';
import { Emoji } from '@emoji-mart/data';
import { useLayoutContext } from '@/shared/lib/hooks/useLayoutContext';
import { useConversationContext } from '@/pages/Conversation/lib/hooks/useConversationContext';

export const useEmojiPicker = (textareaRef: React.MutableRefObject<HTMLTextAreaElement | null>) => {
    const { setConversationDrafts } = useLayoutContext()
    const { data } = useConversationContext()

    const [isOpen, setIsOpen] = React.useState(false);

    const onEmojiSelect = React.useCallback((emoji: Emoji) => {
        setConversationDrafts((prevState) => {
            const newState = new Map([...prevState]);
            const currentState = newState.get(data?.conversation._id) ?? { value: '', state: 'send', selectedMessage: null };

            newState.set(data?.conversation._id, { ...currentState, value: currentState.value + emoji.native });

            return newState;
        });
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