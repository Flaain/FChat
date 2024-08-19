import Picker from '@emoji-mart/react';
import { useTheme } from '@/entities/theme/lib/hooks/useTheme';
import { Emoji } from '../model/types';

const EmojiPicker = ({
    onClickOutside,
    onEmojiSelect
}: {
    onEmojiSelect: (emoji: Emoji) => void;
    onClickOutside: () => void;
}) => {
    const { theme } = useTheme();

    return <Picker autoFocus theme={theme} data={async () => {
        const response = await fetch('https://cdn.jsdelivr.net/npm/@emoji-mart/data')
    
        return response.json();
      }} onEmojiSelect={onEmojiSelect} onClickOutside={onClickOutside} />;
};

export default EmojiPicker;