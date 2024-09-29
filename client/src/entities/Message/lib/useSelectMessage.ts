import React from 'react';
import { Message } from '../model/types';

export const useSelectMessage = () => {
    const [isSelecting, setIsSelecting] = React.useState(false);
    const [selectedMessages, setSelectedMessages] = React.useState<Map<string, Message>>(new Map());

    const handleSelectMessage = React.useCallback((message: Message) => {
        setSelectedMessages((prevState) => {
            const hasMessage = prevState.has(message._id);

            if (hasMessage && !(prevState.size - 1)) {
                setIsSelecting(false);
                return new Map();
            }

            const newState = new Map([...prevState]);

            !prevState.size && setIsSelecting(true);

            hasMessage ? newState.delete(message._id) : newState.set(message._id, message);

            return newState;
        });
    }, [isSelecting]);

    const handleCancelSelecting = () => {
        setIsSelecting(false);
        setSelectedMessages(new Map());
    };

    return {
        isSelecting,
        selectedMessages,
        handleSelectMessage,
        handleCancelSelecting
    };
};