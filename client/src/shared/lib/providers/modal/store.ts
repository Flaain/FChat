import { AsyncActionOptions, ModalStore } from './types';
import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';

export const useModal = createWithEqualityFn<ModalStore>(
    (set, get) => ({
        modals: [],
        isModalDisabled: false,
        onCloseModal: () => set((prevState) => ({ modals: prevState.modals.slice(0, -1) })),
        onOpenModal: (config) => set((prevState) => ({ modals: [...prevState.modals, config] })),
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
                closeOnSuccess && get().onCloseModal();
            } catch (error) {
                onReject?.(error);
                closeOnError && get().onCloseModal();
            } finally {
                set({ isModalDisabled: false });
            }
        }
    }),
    shallow
);