import React from 'react';
import { OtpState } from '../../types';
import { OTPContext } from './context';

export const OtpProvider = ({ children }: { children: React.ReactNode }) => {
    const [otp, setOtp] = React.useState<OtpState>({
        retryDelay: 0,
        type: null!
    });

    const value = React.useMemo(() => ({ otp, setOtp }), [otp]);

    return <OTPContext.Provider value={value}>{children}</OTPContext.Provider>;
};