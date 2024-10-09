import React from 'react';
import { Typography } from '@/shared/ui/Typography';
import { getOtpRetryTime } from '../lib/getOtpRetryTime';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/shared/ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Button } from '@/shared/ui/Button';
import { LoaderCircle } from 'lucide-react';
import { OtpProps } from '../model/types';
import { useOtp } from '../model/store';

export const OTP = React.forwardRef<HTMLInputElement, OtpProps>(({ onComplete, disabled, ...rest }, ref) => {
    const { isResending, otp, onResend } = useOtp();

    const timerRef = React.useRef<NodeJS.Timeout>();

    React.useEffect(() => {
        if (!otp?.retryDelay) return;

        timerRef.current = setInterval(() => {
            useOtp.setState({ otp: { ...otp, retryDelay: otp.retryDelay - 1000 } });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [!!otp?.retryDelay]);

    React.useEffect(() => {
        if (otp?.retryDelay <= 0) {
            clearInterval(timerRef.current);
            useOtp.setState({ otp: { ...otp, retryDelay: 0 } });
        }
    }, [otp?.retryDelay]);

    return (
        <div className='flex flex-col gap-2'>
            <InputOTP
                {...rest}
                ref={ref}
                autoFocus
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                onComplete={onComplete}
                containerClassName='max-w-fit'
                disabled={disabled || isResending}
            >
                <InputOTPGroup>
                    <InputOTPSlot index={0} className='size-12' />
                    <InputOTPSlot index={1} className='size-12' />
                    <InputOTPSlot index={2} className='size-12' />
                    <InputOTPSlot index={3} className='size-12' />
                    <InputOTPSlot index={4} className='size-12' />
                    <InputOTPSlot index={5} className='size-12' />
                </InputOTPGroup>
            </InputOTP>
            {!!otp.retryDelay ? (
                <Typography size='sm' variant='secondary'>
                    Resend your email if it doesn’t arrive in {getOtpRetryTime(otp.retryDelay)}
                </Typography>
            ) : (
                <Button
                    type='button'
                    disabled={isResending}
                    size='text'
                    variant='link'
                    className='self-start'
                    onClick={onResend}
                >
                    {isResending ? (
                        <>
                            <LoaderCircle className='w-4 h-4 animate-spin' />
                            &nbsp;Resend email
                        </>
                    ) : (
                        'Resend email'
                    )}
                </Button>
            )}
        </div>
    );
});