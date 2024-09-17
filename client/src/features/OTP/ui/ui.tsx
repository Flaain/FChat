import React from 'react';
import { Typography } from '@/shared/ui/Typography';
import { getOtpRetryTime } from '../lib/utils/getOtpRetryTime';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/shared/ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Button } from '@/shared/ui/Button';
import { OtpProps } from '../model/types';
import { LoaderCircle } from 'lucide-react';
import { useOtp } from '../model/store';

export const OTP = React.forwardRef<HTMLInputElement, OtpProps>(({ onComplete, disabled, ...rest }, ref) => {
    const { isResending, otp: { retryDelay }, setOtp, onResend } = useOtp();

    const timerRef = React.useRef<NodeJS.Timeout>();

    React.useEffect(() => {
        if (!retryDelay) return;
      
        timerRef.current = setInterval(() => {
          if (retryDelay <= 0) {
            clearInterval(timerRef.current!);
            setOtp({ retryDelay: 0 });
          } else {
            setOtp({ retryDelay: retryDelay - 1000 });
          }
        }, 1000);
      
        return () => clearInterval(timerRef.current);
      }, [!!retryDelay]);

        return (
            <div className='flex flex-col gap-2'>
                <InputOTP
                    autoFocus
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS}
                    onComplete={onComplete}
                    containerClassName='max-w-fit'
                    disabled={disabled || isResending}
                    ref={ref}
                    {...rest}
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
                {!!retryDelay ? (
                    <Typography size='sm' variant='secondary'>
                        Resend your email if it doesn’t arrive in {getOtpRetryTime(retryDelay)}
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
                        {isResending ? <LoaderCircle className='w-4 h-4 animate-spin' /> : 'Resend email'}
                    </Button>
                )}
            </div>
        );
    }
);