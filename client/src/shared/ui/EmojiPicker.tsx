import Picker from '@emoji-mart/react';
import data, { Emoji } from '@emoji-mart/data';
import { useTheme } from '@/entities/theme/lib/hooks/useTheme';

const EmojiPicker = ({
    onClickOutside,
    onEmojiSelect
}: {
    onEmojiSelect: (emoji: Emoji) => void;
    onClickOutside: () => void;
}) => {
    const { theme } = useTheme();

    return <Picker autoFocus theme={theme} data={data} onEmojiSelect={onEmojiSelect} onClickOutside={onClickOutside} />;
};

export default EmojiPicker;