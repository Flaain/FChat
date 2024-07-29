import { OtpProvider } from './contexts/otp/provider';
import { AuthProvider } from './contexts/stage/provider';
import { ProviderProps } from './types';

export const Providers = ({ authStage, children }: ProviderProps) => {
    return (
        <AuthProvider {...authStage}>
            <OtpProvider>{children}</OtpProvider>
        </AuthProvider>
    );
};