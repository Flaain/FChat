export interface SidebarAnouncement {
    title: string;
    description: string;
    icon?: React.ReactNode;
}

export interface SidebarProps {
    announcementTopSlot?: SidebarAnouncement;
    announcementBottomSlot?: SidebarAnouncement;
}