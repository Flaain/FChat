import React from "react";
import { ModalSize } from "@/shared/model/types";

export interface ModalContextProps {
    isAsyncActionLoading: boolean;
    setIsAsyncActionLoading: React.Dispatch<React.SetStateAction<boolean>>;
    openModal: (config: ModalConfig) => void;
    closeModal: (id: string) => void;
}

export interface ModalConfig {
    id: string;
    title?: string;
    size?: ModalSize;
    bodyClassName?: string;
    withCloseButton?: boolean;
    withHeader?: boolean;
    content: React.ReactNode;
}