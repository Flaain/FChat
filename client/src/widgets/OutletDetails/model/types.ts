import { FeedTypes } from "@/shared/model/types";

export interface OutletDetailsProps {
    name: string;
    description?: string;
    info?: React.ReactNode;
    avatarSlot: React.ReactNode;
    type: FeedTypes;
    onClose: () => void;
}