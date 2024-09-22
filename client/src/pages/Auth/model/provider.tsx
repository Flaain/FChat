import React from 'react';
import { AuthStage } from './types';
import { AuthContext } from './context';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [authStage, setAuthStage] = React.useState<AuthStage>('welcome');

    return <AuthContext.Provider value={{ authStage, changeAuthStage: setAuthStage }}>{children}</AuthContext.Provider>;
};