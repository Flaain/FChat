export interface ConfirmationProps {
    onConfirm: () => Promise<void>;
    onCancel: () => void;
    text: string;
    onConfirmText?: string;
    onCancelText?: string;
}