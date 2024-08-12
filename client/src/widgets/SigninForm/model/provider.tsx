import React from 'react';
import { SigninContext } from './context';
import { SigninStages } from '@/features/Signin/model/types';

export const SigninProvider = ({ children }: { children: React.ReactNode }) => {
    const [stage, setStage] = React.useState<SigninStages>('signin');

    const value = React.useMemo(() => ({ stage, setStage }), [stage]);

    return <SigninContext.Provider value={value}>{children}</SigninContext.Provider>;
};