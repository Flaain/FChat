import React from 'react';
import { Draft } from '@/shared/model/types';
import { LayoutContext } from './context';

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
    const [drafts, setDrafts] = React.useState<Map<string, Draft>>(new Map());
    const [isSheetOpen, setIsSheetOpen] = React.useState(false);

    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    const onSheet = React.useCallback((open: boolean) => {
        setIsSheetOpen(open);
    }, []);

    return (
        <LayoutContext.Provider value={{ drafts, isSheetOpen, textareaRef, onSheet, setDrafts }}>
            {children}
        </LayoutContext.Provider>
    );
};