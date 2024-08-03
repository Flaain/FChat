import React from 'react';
import { ModalContextProps } from './types';

export const ModalContext = React.createContext<ModalContextProps>({
    isAsyncActionLoading: false,
    setIsAsyncActionLoading: () => {},
    openModal: () => {},
    closeModal: () => {}
});