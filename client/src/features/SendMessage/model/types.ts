export interface MessageTopBarProps {
    onClose: () => void;
    title: string;
    mainIconSlot: React.ReactNode;
    preventClose?: boolean;
    description?: string;
    closeIconSlot?: React.ReactNode;
}

export interface UseMessageParams {
    type: 'conversation' | 'group';
    showAnchor?: boolean;
    onChange?: (value: string) => void;
    onAnchorClick?: () => void;
    params: {
        id: string;
        apiUrl: string;
        query: Record<string, any>;
    }
}

export interface EmojiMartData {
    categories: Category[];
    emojis: { [key: string]: Emoji };
    aliases: { [key: string]: string };
    sheet: Sheet;
}

export interface Category {
    id: string;
    emojis: string[];
}

export interface EmojiData {
    aliases: Array<string>;
    id: string;
    keywords: Array<string>;
    name: string;
    native: string;
    shortcodes: string;
    skin: number;
    unified: string;
}

export interface Emoji {
    id: string;
    name: string;
    keywords: string[];
    skins: Skin[];
    version: number;
    emoticons?: string[];
}

export interface Skin {
    unified: string;
    native: string;
    x?: number;
    y?: number;
}

export interface Sheet {
    cols: number;
    rows: number;
}