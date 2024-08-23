import { Draft } from '@/shared/model/types';
import { Socket } from 'socket.io-client';

export interface LayoutContextProps {
    openSheet: boolean;
    socket: Socket | null;
    isConnected: boolean;
    setOpenSheet: React.Dispatch<React.SetStateAction<boolean>>;
    drafts: Map<string, Draft>;
    textareaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
    setDrafts: React.Dispatch<React.SetStateAction<Map<string, Draft>>>;
}