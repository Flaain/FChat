import Typography from '@/shared/ui/Typography';
import SignupCredentials from '@/features/SignupCredentials/ui/ui';
import SignupProfile from '@/features/SignupProfile/ui/ui';
import OTP from '@/features/OTP/ui/ui';
import { useSignup } from '../lib/hooks/useSignup';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/Form';
import { Button } from '@/shared/ui/Button';
import { LoaderCircle } from 'lucide-react';

const SignupForm = () => {
    const { form, isLastStep, loading, isNextButtonDisabled, step, stepsLength, onSubmit, onBack } = useSignup();

    const components = {
        0: <SignupCredentials form={form} />,
        1: <SignupProfile form={form} />,
        2: (
            <FormField
                name='otp'
                control={form.control}
                render={({ field }) => {
                    console.log(field);
                    return (
                        <FormItem className='relative'>
                            <FormLabel className='text-white'>Enter verification code</FormLabel>
                            <FormControl>
                                <OTP {...field} email={form.getValues('email')} onComplete={onSubmit} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )
                }}
            />
        )
    };

    return (
        <div className='flex items-center w-full h-full max-w-[1230px] box-border gap-5'>
            <div className='flex flex-col gap-2 items-end max-md:hidden max-w-[450px] w-full'>
                <Typography
                    variant='primary'
                    as='h1'
                    size='6xl'
                    weight='bold'
                    align='right'
                    className='max-lg:text-6xl'
                >
                    {isLastStep ? 'Verify your email' : 'Sign up'}
                </Typography>
                <Typography as='p' size='xl' variant='secondary' align='right' className='max-lg:text-xl'>
                    {isLastStep
                        ? `We’ve sent an email to ${form
                              .getValues('email')
                              .toLowerCase()} with a OTP code to verify your email`
                        : "We're so excited to have you join us!"}
                </Typography>
            </div>
            <Form {...form}>
                <div className='flex max-md:justify-center flex-1 md:pl-5 md:border-l md:border-solid md:border-primary-dark-50 md:h-full'>
                    <form
                        onSubmit={onSubmit}
                        className='flex flex-col gap-4 h-full justify-center md:min-w-[400px] max-w-[560px] w-full'
                    >
                        <Typography variant='primary' weight='medium' className='mb-5'>
                            Step {step + 1} of {stepsLength}
                        </Typography>
                        {components[step as keyof typeof components]}
                        <div className='flex w-full items-center justify-between mt-5'>
                            <Button
                                type='button'
                                variant='secondary'
                                className='w-24'
                                onClick={onBack}
                                disabled={loading}
                            >
                                Back
                            </Button>
                            {!isLastStep && (
                                <Button className='w-24' disabled={isNextButtonDisabled}>
                                    {loading ? <LoaderCircle className='w-5 h-5 animate-loading' /> : 'Submit'}
                                </Button>
                            )}
                        </div>
                    </form>
                </div>
            </Form>
        </div>
    );
};

export default SignupForm;