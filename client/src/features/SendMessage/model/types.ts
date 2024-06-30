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
    queryId: string;
}