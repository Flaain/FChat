export interface OutletDetailsProps {
    name: string;
    description?: string;
    info?: React.ReactNode;
    avatarSlot: React.ReactNode;
    onClose: () => void;
}