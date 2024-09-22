import React from 'react';
import { IOtpContext } from './types';

export const OtpContext = React.createContext<IOtpContext>({
    otp: null!,
    isResending: false,
    onResend: async () => {},
    setOtp: () => {}
});

export const useOtp = () => React.useContext(OtpContext);