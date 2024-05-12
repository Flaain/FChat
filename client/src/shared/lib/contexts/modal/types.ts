import { ModalSize } from "@/shared/model/types";
import React from "react";

export interface ModalContextProps {
    isModalOpen: boolean;
    isAsyncActionLoading: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    openModal: (config: ModalConfig) => void;
    onAsyncActionCall: (params: AsyncFunctionParams) => Promise<void>;
    closeModal: () => void;
}

export interface AsyncFunctionParams {
    asyncAction: () => Promise<void>;
    errorMessage?: string;
}

export interface ModalConfig {
    title?: string;
    size?: ModalSize;
    content: React.ReactNode;
}