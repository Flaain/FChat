import { create } from 'zustand';
import { AsyncActionOptions, ModalConfig, ModalStore } from './types';

export const useModal = create<ModalStore>((set, get) => ({
    modals: [],
    isModalDisabled: false,
    actions: {
        onOpenModal: (config: ModalConfig) => set((prevState) => ({ modals: [...prevState.modals, config] })),
        onCloseModal: () => set((prevState) => ({ modals: prevState.modals.slice(0, -1) })),
        onAsyncActionModal: async <T>(
            cb: () => Promise<T>,
            {
                closeOnError = false,
                closeOnSuccess = true,
                disableOnPending = true,
                onResolve,
                onReject
            }: AsyncActionOptions<T> = {}
        ) => {
            try {
                set({ isModalDisabled: disableOnPending });

                const data = await cb();

                onResolve?.(data);
                closeOnSuccess && get().actions.onCloseModal();
            } catch (error) {
                onReject?.(error);
                closeOnError && get().actions.onCloseModal();
            } finally {
                set({ isModalDisabled: false });
            }
        }
    }
}));

export const selectModalActions = (state: ModalStore) => state.actions;