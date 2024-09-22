import { Draft } from '@/shared/model/types';

export interface ILayoutContext {
    drafts: Map<string, Draft>;
    isSheetOpen: boolean;
    textareaRef: React.RefObject<HTMLTextAreaElement>;
    onSheet: (open: boolean) => void;
    setDrafts: React.Dispatch<React.SetStateAction<Map<string, Draft>>>;
}