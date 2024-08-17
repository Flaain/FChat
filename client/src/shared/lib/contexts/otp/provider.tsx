import React from 'react';
import { OtpContext } from './context';
import { OnResendParams, OtpState } from './types';
import { api } from '@/shared/api';
import { AppException } from '@/shared/api/error';

export const OtpProvider = ({ children }: { children: React.ReactNode }) => {
    const [isResending, setIsResending] = React.useState(false);
    const [otp, setOtp] = React.useState<OtpState>({ retryDelay: 0, type: null! });

    const timerRef = React.useRef<NodeJS.Timeout>();

    const handleResend = React.useCallback(async ({ email, type, onSuccess }: OnResendParams) => {
        try {
            setIsResending(true);

            const { data: { retryDelay } } = await api.otp.create({ email, type: type ?? otp.type });

            setOtp((prevState) => ({ ...prevState, type: type ?? otp.type, retryDelay }));
            onSuccess?.(retryDelay);
        } catch (error) {
            console.error(error);
            error instanceof AppException && error.toastError('Cannot resend OTP code');
        } finally {
            setIsResending(false);
        }
    }, [otp]);

    React.useEffect(() => {
        if (!otp.retryDelay) return;

        timerRef.current = setInterval(() => setOtp((prev) => ({ ...prev, retryDelay: prev.retryDelay - 1000 })), 1000);

        return () => clearInterval(timerRef.current);
    }, [!!otp.retryDelay]);

    React.useEffect(() => {
        if (otp.retryDelay <= 0) {
            clearInterval(timerRef.current!);
            setOtp((prev) => ({ ...prev, retryDelay: 0 }));
        }
    }, [otp.retryDelay]);

    return <OtpContext.Provider value={{ otp, isResending, setOtp, handleResend }}>{children}</OtpContext.Provider>;
};