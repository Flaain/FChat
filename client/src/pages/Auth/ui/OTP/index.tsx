import React from 'react';
import Typography from '@/shared/ui/Typography';
import { api } from '@/shared/api';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/shared/ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/Form';
import { useOtp } from '../../lib/hooks/useOtp';
import { OtpProps } from '../../model/types';
import { OtpType } from '@/shared/model/types';
import { Button } from '@/shared/ui/Button';
import { getOtpRetryTime } from '@/shared/lib/utils/getOtpRetryTime';

const OTP = ({ onComplete, loading, form }: OtpProps) => {
    const { otp: { retryDelay }, setOtp } = useOtp();

    const timerRef = React.useRef<NodeJS.Timeout>();

    const onResend = async () => {
        const { data: { retryDelay } } = await api.otp.create({ email: form.getValues('email'), type: OtpType.EMAIL_VERIFICATION });

        setOtp({ type: OtpType.EMAIL_VERIFICATION, retryDelay });
    };

    React.useEffect(() => {
        if (!retryDelay) return;

        timerRef.current = setInterval(() => setOtp((prev) => ({ ...prev, retryDelay: prev.retryDelay - 1000 })), 1000);

        return () => clearInterval(timerRef.current);
    }, [!!retryDelay]);

    React.useEffect(() => {
        if (retryDelay <= 0) {
            clearInterval(timerRef.current!);
            setOtp((prev) => ({ ...prev, retryDelay: 0 }));
        }
    }, [retryDelay]);

    return (
        <div className='flex flex-col gap-2'>
            <FormField
                name='otp'
                control={form.control}
                render={({ field }) => (
                    <FormItem className='relative'>
                        <FormLabel className='text-white'>Enter verification code</FormLabel>
                        <FormControl>
                            <InputOTP
                                {...field}
                                autoFocus
                                maxLength={6}
                                pattern={REGEXP_ONLY_DIGITS}
                                onComplete={onComplete}
                                containerClassName='max-w-fit'
                                disabled={loading}
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
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {!!retryDelay ? (
                <Typography size='sm' variant='secondary'>Resend your email if it doesn’t arrive in {getOtpRetryTime(retryDelay)}</Typography>
            ) : (
                <Button size='text' variant='link' className='self-start' onClick={onResend}>Resend email</Button>
            )}
        </div>
    );
};

export default OTP;
