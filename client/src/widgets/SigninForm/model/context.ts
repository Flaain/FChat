import { createStore } from 'zustand';
import { SigninStore } from './types';
import { createZustandContext } from '@/shared/lib/utils/createZustandContext';

export const { Provider: SigninFormProvider, useContext: useSigninForm } = createZustandContext<SigninStore>(() => createStore((set) => ({
    stage: 'signin',
    setStage: (stage) => set({ stage })
})));