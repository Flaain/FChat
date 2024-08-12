import React from 'react';
import { OtpContextProps } from './types';

export const OtpContext = React.createContext<OtpContextProps>({
    otp: { value: '', type: null!, retryDelay: 0, error: null },
    isResending: false,
    setOtp: () => {},
    onChange: () => {},
    onResend: () => {}
});