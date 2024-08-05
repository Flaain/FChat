export interface ConfirmationProps {
    onConfirm: () => void | Promise<void>;
    onCancel: () => void;
    text: string;
    onConfirmText?: string;
    onCancelText?: string;
}