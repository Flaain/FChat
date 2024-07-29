import { ConversationFeed, GroupFeed } from "@/shared/model/types";

export interface SidebarAnouncement {
    title: string;
    description: string;
    icon?: React.ReactNode;
}

export interface SidebarProps {
    announcementTopSlot?: SidebarAnouncement;
    announcementBottomSlot?: SidebarAnouncement;
}

export interface UseSidebarEventsProps {
    setLocalResults: React.Dispatch<React.SetStateAction<Array<ConversationFeed | GroupFeed>>>;
}
