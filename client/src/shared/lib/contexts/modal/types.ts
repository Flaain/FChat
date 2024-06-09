import React from "react";
import { ModalSize } from "@/shared/model/types";

export interface ModalContextProps {
    isModalOpen: boolean;
    isAsyncActionLoading: boolean;
    handleChangeTitle: (title: string) => void;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsAsyncActionLoading: React.Dispatch<React.SetStateAction<boolean>>;
    openModal: (config: ModalConfig) => void;
    closeModal: () => void;
}

export interface ModalConfig {
    title?: string;
    size?: ModalSize;
    content: React.ReactNode;
}