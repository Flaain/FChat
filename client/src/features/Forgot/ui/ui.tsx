import OTP from '@/features/OTP/ui/ui';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/Form';
import { Button } from '@/shared/ui/Button';
import { LoaderCircle } from 'lucide-react';
import { PasswordInput } from '@/shared/ui/PasswordInput';
import { useForgot } from '../lib/hooks/useForgot';
import { OtpType } from '@/shared/lib/contexts/otp/types';
import { Input } from '@/shared/ui/Input';

const buttonTitles = {
    0: 'Send email',
    2: "Reset"
}

const Forgot = () => {
    const { form, isNextButtonDisabled, isLoading, onSubmit, onBack, step } = useForgot();

    return (
        <Form {...form}>
            <div className='flex max-md:justify-center flex-1 md:pl-5 md:border-l md:border-solid md:border-primary-dark-50 md:h-full'>
                <form
                    onSubmit={onSubmit}
                    className='flex flex-col gap-4 h-full justify-center md:min-w-[400px] max-w-[560px] w-full'
                >
                    {!step && (
                        <FormField
                            name='email'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-white'>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder='Enter your email address'
                                            className='focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300 placeholder:ease-in-out dark:ring-offset-0 dark:focus-visible:ring-primary-dark-50 dark:focus:bg-primary-dark-200 dark:bg-primary-dark-100 border-none text-white hover:ring-1 dark:placeholder:text-white placeholder:opacity-50 dark:hover:ring-primary-dark-50'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                    {step === 1 && (
                        <FormField
                            name='otp'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className='relative'>
                                    <FormLabel className='text-white'>Enter verification code</FormLabel>
                                    <FormControl>
                                        <OTP
                                            {...field}
                                            email={form.getValues('email')}
                                            onComplete={onSubmit}
                                            type={OtpType.PASSWORD_RESET}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                    {step === 2 && (
                        <>
                            <FormField
                                name='password'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-white'>Password</FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                {...field}
                                                placeholder='Enter your password'
                                                className='focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300 placeholder:ease-in-out dark:ring-offset-0 dark:focus-visible:ring-primary-dark-50 dark:focus:bg-primary-dark-200 dark:bg-primary-dark-100 border-none text-white hover:ring-1 dark:placeholder:text-white placeholder:opacity-50 dark:hover:ring-primary-dark-50'
                                                value={field.value.replace(/\s/g, '')}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name='confirmPassword'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-white'>Confirm password</FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                {...field}
                                                placeholder='Confirm your password'
                                                className='focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300 placeholder:ease-in-out dark:ring-offset-0 dark:focus-visible:ring-primary-dark-50 dark:focus:bg-primary-dark-200 dark:bg-primary-dark-100 border-none text-white hover:ring-1 dark:placeholder:text-white placeholder:opacity-50 dark:hover:ring-primary-dark-50'
                                                value={field.value.replace(/\s/g, '')}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                    <div className='flex w-full items-center justify-between'>
                        <Button
                            type='button'
                            variant='secondary'
                            className='w-24'
                            onClick={onBack}
                            disabled={isLoading}
                        >
                            Back
                        </Button>
                        {step !== 1 && (
                            <Button className='w-24' disabled={isNextButtonDisabled}>
                                {isLoading ? <LoaderCircle className='w-5 h-5 animate-loading' /> : buttonTitles[step as keyof typeof buttonTitles]}
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </Form>
    );
};

export default Forgot;