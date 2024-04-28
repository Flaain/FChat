import React from "react";
import { ModalContextProps } from "./types";

export const ModalContext = React.createContext<ModalContextProps>({
    isModalOpen: false,
    setIsModalOpen: () => {},
    openModal: () => {},
    closeModal: () => {},
});