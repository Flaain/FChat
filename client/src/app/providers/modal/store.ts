import { create } from 'zustand';
import { AsyncActionParams, ModalStore } from './types';

export const useModal = create<ModalStore>((set, get) => ({
    modals: [],
    isModalDisabled: false,
    onCloseModal: () => set((prevState) => ({ modals: prevState.modals.slice(0, -1) })),
    onOpenModal: (config) => set((prevState) => ({ modals: [...prevState.modals, config] })),
    onAsyncActionModal: async <T>({ promise, closeOnError, disableOnPending = true, onReject, onResolve }: AsyncActionParams<T>) => {
        try {
            set({ isModalDisabled: disableOnPending });

            const data = await promise;

            onResolve?.(data);
            get().onCloseModal();

            return data;
        } catch (error) {
            onReject?.(error);
            closeOnError && get().onCloseModal();
            throw error;
        } finally {
            set({ isModalDisabled: false });
        }
    }
}));