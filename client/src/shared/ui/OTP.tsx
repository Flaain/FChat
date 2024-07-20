import { SignupSchemaType } from '@/pages/Auth/model/types';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/shared/ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './Form';

const OTP = ({
    onComplete,
    loading,
    form
}: {
    onComplete: () => void;
    loading?: boolean;
    form: UseFormReturn<SignupSchemaType>;
}) => {
    return (
        <FormField
            name='otp'
            control={form.control}
            render={({ field }) => (
                <FormItem className='relative'>
                    <FormLabel className='text-white'>Enter verification code</FormLabel>
                    <FormControl>
                        <InputOTP
                            {...field}
                            maxLength={6}
                            pattern={REGEXP_ONLY_DIGITS}
                            onComplete={onComplete}
                            autoFocus
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
    );
};

export default OTP;
