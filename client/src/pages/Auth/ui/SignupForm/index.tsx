import React from 'react';
import FirstStepSignUp from '../FirstStepSignUp';
import SecondStepSignUp from '../SecondStepSignUp';
import Typography from '@/shared/ui/Typography';
import OTP from '@/pages/Auth/ui/OTP';
import RightBlock from '../RightBlock';
import LeftBlock from '../LeftBlock';
import FormContainer from '../FormContainer';
import { useSignup } from '../../lib/hooks/useSignup';

const SignupForm = () => {
    const { form, loading, step, stepsLength, isLastStep, isNextButtonDisabled, onBack, onSubmit } = useSignup();

    const forms: Record<number, React.ReactNode> = {
        0: <FirstStepSignUp form={form} />,
        1: <SecondStepSignUp form={form} />,
        2: <OTP onComplete={onSubmit} loading={loading} form={form} />
    };

    return (
        <FormContainer>
            <LeftBlock
                title={isLastStep ? 'Verify your email' : 'Sign up'}
                description={
                    isLastStep
                        ? `We’ve sent an email to ${form.getValues('email').toLowerCase()} with a OTP code to verify your email`
                        : "We're so excited to have you join us!"
                }
            />
            <RightBlock
                form={form}
                onSubmit={onSubmit}
                loading={loading}
                onBack={onBack}
                isSubmitButtonDisabled={isNextButtonDisabled}
                isSubmitButtonHidden={isLastStep}
            >
                <Typography variant='primary' weight='medium' className='mb-5'>
                    Step {step + 1} of {stepsLength}
                </Typography>
                {forms[step]}
            </RightBlock>
        </FormContainer>
    );
};

export default SignupForm;