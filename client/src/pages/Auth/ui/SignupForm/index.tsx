import React from 'react';
import FirstStepSignUp from '../FirstStepSignUp';
import SecondStepSignUp from '../SecondStepSignUp';
import Typography from '@/shared/ui/Typography';
import OTP from '@/pages/Auth/ui/OTP';
import { Form } from '@/shared/ui/Form';
import { Button } from '@/shared/ui/Button';
import { useSignup } from '../../lib/hooks/useSignup';
import { LoaderCircle } from 'lucide-react';
import { AuthContainer } from '../AuthContainer';

const SignupForm = () => {
    const { form, loading, step, stepsLength, isLastStep, isNextButtonDisabled, onBack, onSubmit } = useSignup();

    const forms: Record<number, React.ReactNode> = {
        0: <FirstStepSignUp form={form} />,
        1: <SecondStepSignUp form={form} />,
        2: <OTP onComplete={onSubmit} loading={loading} form={form} />
    };

    return (
        <div className='flex items-center w-full h-full max-w-[1230px] box-border gap-5'>
            <div className='flex flex-col gap-2 items-end max-md:hidden max-w-[450px] w-full'>
                <Typography variant='primary' as='h1' size='6xl' weight='bold' align='right' className='max-lg:text-6xl'>
                    {isLastStep ? 'Verify email' : 'Create account'}
                </Typography>
                <Typography as='p' size='xl' variant='secondary' align='right' className='max-lg:text-xl'>
                    {isLastStep
                        ? `We’ve sent an email to ${form.getValues('email')} with a OTP code to verify your email`
                        : "We're so excited to have you join us!"}
                </Typography>
            </div>
            <Form {...form}>
                <AuthContainer>
                    <form
                        onSubmit={onSubmit}
                        className='flex flex-col gap-4 h-full justify-center md:min-w-[400px] max-w-[560px] w-full'
                    >
                        <Typography variant='primary' weight='medium' className='mb-5'>
                            Step {step + 1} of {stepsLength}
                        </Typography>
                        {forms[step]}
                        <div className='flex w-full items-center justify-between mt-5 gap-2'>
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
                                    {loading ? <LoaderCircle className='w-5 h-5 animate-loading' /> : 'Next'}
                                </Button>
                            )}
                        </div>
                    </form>
                </AuthContainer>
            </Form>
        </div>
    );
};

export default SignupForm;