import React from 'react';
import { OtpContextProps } from './types';

export const OtpContext = React.createContext<OtpContextProps>({
    otp: { type: null!, retryDelay: 0 },
    isResending: false,
    setOtp: () => {},
    onResend: () => {}
});