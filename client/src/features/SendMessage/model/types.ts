export interface MessageTopBarProps {
    onClose: () => void;
    title: string;
    description?: string;
    closeIconSlot?: React.ReactNode;
}