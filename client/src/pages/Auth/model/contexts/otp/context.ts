import React from 'react';
import { OTPContextProps } from '../../types';

export const OTPContext = React.createContext<OTPContextProps>({
    otp: { type: null!, retryDelay: 0 },
    setOtp: () => {}
});