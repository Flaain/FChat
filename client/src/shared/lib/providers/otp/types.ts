import React from 'react';

export enum OtpType {
    EMAIL_VERIFICATION = 'email_verification',
    PASSWORD_RESET = 'password_reset'
}

export interface Otp {
    targetEmail: string;
    retryDelay: number;
    type: OtpType;
}

export interface IOtpContext {
    otp: Otp;
    isResending: boolean;
    setOtp: React.Dispatch<React.SetStateAction<Otp>>;
    onResend: () => Promise<void>;
}

export interface OtpProps extends Omit<React.HTMLAttributes<HTMLInputElement>, 'onChange'> {
    disabled?: boolean;
    onComplete: (event?: React.FormEvent<HTMLFormElement>) => void;
}