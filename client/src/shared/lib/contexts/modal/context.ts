import React from 'react';
import { ModalContextProps } from './types';

export const ModalContext = React.createContext<ModalContextProps>({
    isModalOpen: false,
    isAsyncActionLoading: false,
    setIsModalOpen: () => {},
    onAsyncActionCall: async () => {},
    openModal: () => {},
    closeModal: () => {}
});