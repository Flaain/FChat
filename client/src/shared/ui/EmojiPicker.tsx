import Picker from '@emoji-mart/react';
import { EmojiData } from '../model/types';
import { useTheme } from '@/entities/theme';

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
    
        return response.json();
      }} onEmojiSelect={onEmojiSelect} onClickOutside={onClickOutside} />;
};