import React from 'react';
import { Typography } from '@/shared/ui/Typography';
import { getOtpRetryTime } from '../lib/getOtpRetryTime';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/shared/ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Button } from '@/shared/ui/Button';
import { LoaderCircle } from 'lucide-react';
import { OtpProps } from '@/shared/lib/providers/otp/types';
import { useOtp } from '@/shared/lib/providers/otp/context';

export const OTP = React.forwardRef<HTMLInputElement, OtpProps>(({ onComplete, disabled, ...rest }, ref) => {
    const { isResending, otp: { retryDelay }, onResend } = useOtp();

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