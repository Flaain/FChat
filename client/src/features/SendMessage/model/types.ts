export interface MessageTopBarProps {
    onClose: () => void;
    title: string;
    preventClose?: boolean;
    description?: string;
    closeIconSlot?: React.ReactNode;
}