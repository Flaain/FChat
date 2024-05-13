import React from 'react';
import { useConversationContainer } from '@/widgets/ConversationContainer/lib/hooks/useConversationContainer';
import { ContainerConversationTypes } from '@/widgets/ConversationContainer/model/types';
import { Emoji } from '@emoji-mart/data';

export const useEmojiPicker = () => {
    const {
        state: { messageInputValue },
        dispatch
    } = useConversationContainer();
    const [isOpen, setIsOpen] = React.useState(false);

    const onEmojiSelect = React.useCallback(
        (emoji: Emoji) => {
            dispatch({
                type: ContainerConversationTypes.SET_MESSAGE_INPUT_VALUE,
                payload: { value: messageInputValue + emoji.native }
            });

        },
        [dispatch, messageInputValue]
    );

    const openEmojiPicker = React.useCallback(
        (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            event.stopPropagation();
            setIsOpen((prevState) => !prevState);
        },
        [setIsOpen]
    );

    const onClickOutside = React.useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen]);

    return { isOpen, onEmojiSelect, onClickOutside, openEmojiPicker };
};