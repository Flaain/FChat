import React from 'react';
import { useConversationContainer } from '@/widgets/ConversationContainer/lib/hooks/useConversationContainer';
import { ContainerConversationTypes } from '@/widgets/ConversationContainer/model/types';
import { Emoji } from '@emoji-mart/data';

export const useEmojiPicker = (textareaRef: React.MutableRefObject<HTMLTextAreaElement | null>) => {
    const { state: { value }, dispatch } = useConversationContainer();
    const [isOpen, setIsOpen] = React.useState(false);

    const onEmojiSelect = React.useCallback((emoji: Emoji) => {
        dispatch({
            type: ContainerConversationTypes.SET_VALUE,
            payload: { value: value + emoji.native }
        });

        textareaRef.current?.focus();
    }, [dispatch, value]);

    const openEmojiPicker = React.useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        setIsOpen((prevState) => !prevState);
    }, [setIsOpen]);

    const onClickOutside = React.useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen]);

    return { isOpen, onEmojiSelect, onClickOutside, openEmojiPicker };
};