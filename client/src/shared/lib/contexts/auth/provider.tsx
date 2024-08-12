import React from 'react';
import { AuthContext } from './context';
import { AuthContextProps, AuthProviderProps, AuthStage } from './types';
import { OtpProvider } from '../otp/provider';

export const AuthProvider = ({ defaultStage = 'welcome', children }: AuthProviderProps) => {
    const [authStage, setAuthStage] = React.useState<AuthStage>(defaultStage);

    const value = React.useMemo<AuthContextProps>(() => ({
        authStage,
        setAuthStage
    }), [authStage]);

    return (
        <AuthContext.Provider value={value}>
            <OtpProvider>{children}</OtpProvider>
        </AuthContext.Provider>
    );
};