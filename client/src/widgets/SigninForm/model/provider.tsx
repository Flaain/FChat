import React from 'react';
import { SigninStages } from '@/features/Signin/model/types';
import { SigninContext } from './context';

export const SigninProvider = ({ children }: { children: React.ReactNode }) => {
    const [stage, setStage] = React.useState<SigninStages>('signin');

    return <SigninContext.Provider value={{ stage, setStage }}>{children}</SigninContext.Provider>;
};