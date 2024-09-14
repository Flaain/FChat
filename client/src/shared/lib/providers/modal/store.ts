import { create } from 'zustand';
import { AsyncActionOptions, ModalStore } from './types';

export const useModal = create<ModalStore>((set, get) => ({
    modals: [],
    isModalDisabled: false,
    onCloseModal: () => set((prevState) => ({ modals: prevState.modals.slice(0, -1) })),
    onOpenModal: (config) => set((prevState) => ({ modals: [...prevState.modals, config] })),
    onAsyncActionModal: async <T>(cb: () => Promise<T>, { closeOnError = true, disableOnPending = true, onResolve, onReject }: AsyncActionOptions<T> = {}) => {
        try {
            set({ isModalDisabled: disableOnPending });

            const data = await cb();

            onResolve?.(data);
            get().onCloseModal();

            return data;
        } catch (error) {
            onReject?.(error);
            closeOnError && get().onCloseModal();
        } finally {
            set({ isModalDisabled: false });
        }
    }
}));