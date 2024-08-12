import React from 'react';
import { OtpContext } from './context';
import { OnResendParams, OtpState } from './types';
import { api } from '@/shared/api';
import { AppException } from '@/shared/api/error';
import { toast } from 'sonner';

export const OtpProvider = ({ children }: { children: React.ReactNode }) => {
    const [isResending, setIsResending] = React.useState(false);
    const [otp, setOtp] = React.useState<OtpState>({
        value: '',
        retryDelay: 0,
        type: null!,
        error: null
    });

    const timerRef = React.useRef<NodeJS.Timeout>();

    const onChange = React.useCallback((value: string) => setOtp((prevState) => ({ ...prevState, value })), []);

    const onResend = React.useCallback(async ({ email, type }: OnResendParams) => {
        try {
            setIsResending(true);

            const { data: { retryDelay } } = await api.otp.create({ email, type: type ?? otp.type });

            setOtp((prevState) => ({ ...prevState, type: type ?? otp.type, retryDelay }));
        } catch (error) {
            if (error instanceof AppException) {
                const appError = error; // <-- this shit is necessary cuz of ('error' is of type 'unknown') in setOtp

                setOtp((prevState) => ({ ...prevState, error: appError.message }));
                toast.error(appError.message ?? "Cannot resend OTP code", { position: "top-center" });
            }
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

    const value = React.useMemo(() => ({ otp, isResending, setOtp, onResend, onChange }), [otp]);

    return <OtpContext.Provider value={value}>{children}</OtpContext.Provider>;
};