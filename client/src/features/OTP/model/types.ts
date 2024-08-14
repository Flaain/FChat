import React from 'react';
import { OtpType } from '@/shared/lib/contexts/otp/types';

export interface OtpProps extends Omit<React.HTMLAttributes<HTMLInputElement>, 'onChange'> {
    email: string;
    type?: OtpType;
    loading?: boolean;
    onResend?: () => void;
    onComplete: (event?: React.FormEvent<HTMLFormElement>) => void;
}