import React from 'react';
import { ILayoutContext } from './types';

export const LayoutContext = React.createContext<ILayoutContext>({
    drafts: new Map(),
    isSheetOpen: false,
    textareaRef: React.createRef<HTMLTextAreaElement>(),
    onSheet: () => {},
    setDrafts: () => {}
});

export const useLayout = () => React.useContext(LayoutContext);