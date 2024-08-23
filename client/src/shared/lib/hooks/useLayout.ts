import React from 'react';
import { Draft } from '@/shared/model/types';
import { useSocket } from './useSocket';

export const useLayout = () => {
    const { socket, isConnected } = useSocket();

    const [drafts, setDrafts] = React.useState<Map<string, Draft>>(new Map());
    const [openSheet, setOpenSheet] = React.useState(false);

    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    return {
        socket,
        textareaRef,
        isConnected,
        drafts,
        openSheet,
        setOpenSheet,
        setDrafts
    };
};