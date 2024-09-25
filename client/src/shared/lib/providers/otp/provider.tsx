import React from 'react';
import { Otp } from './types';
import { otpAPI } from '@/features/OTP';
import { toast } from 'sonner';
import { OtpContext } from './context';

export const OtpProvider = ({ children }: { children: React.ReactNode }) => {
    const [otp, setOtp] = React.useState<Otp>(null!);
    const [isResending, setIsResending] = React.useState(false);

    const onResend = async () => {
        try {
            setIsResending(true);

            const { data: { retryDelay } } = await otpAPI.create({ email: otp.targetEmail, type: otp.type });

            setOtp((prevState) => ({ ...prevState, retryDelay }));
        } catch (error) {
            console.error(error);
            toast.error('Cannot resend OTP code');
        } finally {
            setIsResending(false);
        }
    };

    const timerRef = React.useRef<NodeJS.Timeout>();

    React.useEffect(() => {
        if (!otp?.retryDelay) return;
      
        timerRef.current = setInterval(() => {
          setOtp((prevState) => ({ ...prevState, retryDelay: prevState.retryDelay - 1000 }));
        }, 1000);
      
        return () => clearInterval(timerRef.current);
      }, [!!otp?.retryDelay]);

    React.useEffect(() => {
        if (otp?.retryDelay <= 0) {
          clearInterval(timerRef.current);
          setOtp((prevState) => ({ ...prevState, retryDelay: 0 }));
        }
      }, [otp?.retryDelay]);

    return (
        <OtpContext.Provider value={{ otp, isResending, setOtp, onResend }}>
            {children}
        </OtpContext.Provider>
    );
};