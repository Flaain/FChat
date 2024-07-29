import React from 'react';
import { Drafts } from '@/shared/model/types';
import { useSocket } from './useSocket';

export const useLayout = () => {
    const { socket, isConnected } = useSocket();

    const [drafts, setDrafts] = React.useState<Map<string, Drafts>>(new Map());
    const [openSheet, setOpenSheet] = React.useState(false);

    return {
        socket,
        isConnected,
        drafts,
        openSheet,
        setOpenSheet,
        setDrafts
    };
};