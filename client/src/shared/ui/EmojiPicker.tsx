import Picker from '@emoji-mart/react';
import { useTheme } from '@/entities/theme';
import { EmojiData } from '@/features/SendMessage/model/types';

export const EmojiPicker = ({
    onClickOutside,
    onEmojiSelect
}: {
    onEmojiSelect: (emoji: EmojiData) => void;
    onClickOutside: () => void;
}) => {
    const { theme } = useTheme();

    return <Picker autoFocus theme={theme} data={async () => {
        const response = await fetch('https://cdn.jsdelivr.net/npm/@emoji-mart/data')
        const data = await response.json();

        return data;
      }} onEmojiSelect={onEmojiSelect} onClickOutside={onClickOutside} />;
};