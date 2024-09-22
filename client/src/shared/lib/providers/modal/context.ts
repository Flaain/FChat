import React from 'react';
import { IModalContext } from './types';

export const ModalContext = React.createContext<IModalContext>({
    modals: [],
    onAsyncActionModal: async () => {},
    onCloseModal: () => {},
    onOpenModal: () => {},
    isModalDisabled: false
});

export const useModal = () => React.useContext(ModalContext)